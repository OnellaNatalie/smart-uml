import math

import cv2
import numpy as np

import app
from config.database import db
from decimal import Decimal
from models.actor_and_use_case import ActorANDUseCase
from models.actor_generalization_relationship import ActorGeneralizationRelationship
from models.use_case_association_relationship import UseCaseAssociationRelationship
from models.use_case_generalization_relationship import UseCaseGeneralizationRelationship


def detect_relationships(filename, boxes, accurate_indexes, use_case_id):
    image = cv2.imread(app.SUBMISSION_PATH + '/' + filename)
    detect_generalization_relationship(image, boxes, accurate_indexes, use_case_id)


def detect_generalization_relationship(image, boxes, accurate_indexes, use_case_id):
    img1 = hide_detected_components(image, boxes, accurate_indexes)
    img2 = remove_rectangle(img1)
    img3 = recover_broke_line(img2)
    gray_image = cv2.cvtColor(img3, cv2.COLOR_BGR2GRAY)
    _, thresh_image = cv2.threshold(gray_image, 100, 255, cv2.THRESH_BINARY_INV)
    arrow_image = get_filter_arrow_image(thresh_image)

    if arrow_image is not None:
        all_objects = ActorANDUseCase.query.filter_by(use_case_answer=use_case_id).all()
        result = get_arrow_info(arrow_image, all_objects, use_case_id)


def hide_detected_components(image, boxes, accurate_indexes):
    height, width, c = image.shape
    for i in range(0, len(accurate_indexes)):
        ymin = boxes[i][0] * height
        xmin = boxes[i][1] * width
        ymax = boxes[i][2] * height
        xmax = boxes[i][3] * width

        cv2.rectangle(image, (int(xmin), int(ymin)), (int(xmax), int(ymax)), (255, 255, 255), -1)
    return image


def remove_rectangle(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thrash = cv2.threshold(gray_image, 240, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thrash, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

    for contour in contours:
        shape = cv2.approxPolyDP(contour, 0.05 * cv2.arcLength(contour, True), True)

        if len(shape) == 4:
            cv2.drawContours(image, [shape], 0, (255, 255, 255), 3)

    return image


def recover_broke_line(image):
    kernel1 = np.ones((3, 5), np.uint8)
    kernel2 = np.ones((9, 9), np.uint8)

    imgGray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    imgBW = cv2.threshold(imgGray, 230, 255, cv2.THRESH_BINARY_INV)[1]

    img1 = cv2.erode(imgBW, kernel1, iterations=1)
    img2 = cv2.dilate(img1, kernel2, iterations=3)
    img3 = cv2.bitwise_and(imgBW, img2)
    img3 = cv2.bitwise_not(img3)
    img4 = cv2.bitwise_and(imgBW, imgBW, mask=img3)
    imgLines = cv2.HoughLinesP(img4, 1, np.pi / 180, 40, minLineLength=0, maxLineGap=10)

    for i in range(len(imgLines)):
        for x1, y1, x2, y2 in imgLines[i]:
            cv2.line(image, (x1, y1), (x2, y2), (0, 0, 0), 2)

    return image


def get_filter_arrow_image(threslold_image):
    blank_image = np.zeros_like(threslold_image)

    kernel_dilate = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    threslold_image = cv2.dilate(threslold_image, kernel_dilate, iterations=1)

    contours, hierarchy = cv2.findContours(threslold_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    if hierarchy is not None:

        threshold_distnace = 100

        for cnt in contours:
            hull = cv2.convexHull(cnt, returnPoints=False)
            defects = cv2.convexityDefects(cnt, hull)
            if defects is not None:
                for i in range(defects.shape[0]):
                    start_index, end_index, farthest_index, distance = defects[i, 0]

                    if distance > threshold_distnace:
                        cv2.drawContours(blank_image, [cnt], -1, 225, -1)

        return blank_image
    else:
        return None


def get_length(p1, p2):
    line_length = ((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2) ** 0.5
    return line_length


def get_max_distace_point(cnt):
    max_distance = 0
    max_points = None
    for [[x1, y1]] in cnt:
        for [[x2, y2]] in cnt:
            distance = get_length((x1, y1), (x2, y2))

            if distance > max_distance:
                max_distance = distance
                max_points = [(x1, y1), (x2, y2)]

    return max_points


def angle_beween_points(a, b):
    arrow_slope = (a[0] - b[0]) / (a[1] - b[1])
    arrow_angle = math.degrees(math.atan(arrow_slope))
    return arrow_angle


def get_arrow_info(arrow_image, all_objects, use_case_id):
    contours, hierarchy = cv2.findContours(arrow_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if hierarchy is not None:

        for cnt in contours:
            blank_image = np.zeros_like(arrow_image)
            cv2.drawContours(blank_image, [cnt], -1, 255, -1)

            point1, point2 = get_max_distace_point(cnt)

            component_1 = find_closest_components_length(point1, all_objects)
            component_2 = find_closest_components_length(point2, all_objects)

            if component_1.type == 'use case' and component_2.type == 'use case':
                use_case_generalization_obj = UseCaseGeneralizationRelationship(use_case_answer=use_case_id,
                                                                                connected_component_01=component_1.id,
                                                                                connected_component_02=component_2.id)
                db.session.add(use_case_generalization_obj)
                db.session.commit()

            elif component_1.type == "actor" and component_2.type == "actor":
                actor_generalization_obj = ActorGeneralizationRelationship(use_case_answer=use_case_id,
                                                                           connected_component_01=component_1.id,
                                                                           connected_component_02=component_2.id)
                db.session.add(actor_generalization_obj)
                db.session.commit()

            else:
                association_obj = UseCaseAssociationRelationship(use_case_answer=use_case_id,
                                                                 connected_component_01=component_1.id,
                                                                 connected_component_02=component_2.id)
                db.session.add(association_obj)
                db.session.commit()


    else:
        return None


def find_closest_components_length(point, all_objects):
    component = None
    min_length = 1000000000
    for obj in all_objects:

        ymin = Decimal(obj.y_min)
        xmin = Decimal(obj.x_min)
        ymax = Decimal(obj.y_max)
        xmax = Decimal(obj.x_max)

        usecase_x = xmin + (xmax - xmin) / 2
        usecase_y = ymin + (ymax - ymin) / 2

        usecase_point = (int(usecase_x), int(usecase_y))

        l_length = ((point[0] - usecase_point[0]) ** 2 + (point[1] - usecase_point[1]) ** 2) ** 0.5

        if min_length > l_length:
            min_length = l_length
            component = obj

    return component
