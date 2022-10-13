import math
from decimal import Decimal

import cv2
import keras_ocr
import numpy as np
import spacy
from paddleocr import PaddleOCR, draw_ocr  # main OCR dependencies
from config.database import db

import app
from models.class_component_model import Component
from models.class_relationship_model import Relationship
from models.class_relationship_muplicity import Multiplicity


def detect_class_relationship(image_nparray, boxes, index, class_comp_id, category):
    height, width, c = image_nparray.shape
    class_objects = Component.query.filter_by(class_answer=class_comp_id).all()

    ymin = boxes[index][0] * height
    xmin = boxes[index][1] * width
    ymax = boxes[index][2] * height
    xmax = boxes[index][3] * width

    crop_img = image_nparray[int(ymin):int(ymax), int(xmin):int(xmax)]

    img = remove_text(crop_img)

    if category == 'realization':
        img = line_recovery(img)

    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh_image = cv2.threshold(gray_image, 100, 255, cv2.THRESH_BINARY_INV)
    arrow_image = get_filter_arrow_image(thresh_image)

    if arrow_image is not None:
        arrow_info_image, point1, point2 = get_arrow_info(arrow_image)
        point1_x = int(xmin) + point1[0]
        point1_y = int(ymin) + point1[1]
        point2_x = int(xmin) + point2[0]
        point2_y = int(ymin) + point2[1]

        line_point1 = (point1_x, point1_y)
        line_point2 = (point2_x, point2_y)

        class_object1 = find_closest_components_length(line_point1, class_objects)

        class_object2 = find_closest_components_length(line_point2, class_objects)

        relationship_details_detection(image_nparray, boxes, index, class_comp_id, category, class_object1,
                                       class_object2)


def midpoint(x1, y1, x2, y2):
    x_mid = int((x1 + x2) / 2)
    y_mid = int((y1 + y2) / 2)
    return (x_mid, y_mid)


def remove_text(img_path):
    # read image
    pipeline = keras_ocr.pipeline.Pipeline()
    img = keras_ocr.tools.read(img_path)
    # generate (word, box) tuples
    prediction_groups = pipeline.recognize([img])
    mask = np.zeros(img.shape[:2], dtype="uint8")
    for box in prediction_groups[0]:
        x0, y0 = box[1][0]
        x1, y1 = box[1][1]
        x2, y2 = box[1][2]
        x3, y3 = box[1][3]

        x_mid0, y_mid0 = midpoint(x1, y1, x2, y2)
        x_mid1, y_mi1 = midpoint(x0, y0, x3, y3)

        thickness = int(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2))

        cv2.line(mask, (x_mid0, y_mid0), (x_mid1, y_mi1), 255,
                 thickness)
        img = cv2.inpaint(img, mask, 7, cv2.INPAINT_NS)

    return img


def line_recovery(img):
    kernel1 = np.ones((3, 5), np.uint8)
    kernel2 = np.ones((9, 9), np.uint8)

    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBW = cv2.threshold(imgGray, 230, 255, cv2.THRESH_BINARY_INV)[1]

    img1 = cv2.erode(imgBW, kernel1, iterations=1)
    img2 = cv2.dilate(img1, kernel2, iterations=3)
    img3 = cv2.bitwise_and(imgBW, img2)
    img3 = cv2.bitwise_not(img3)
    img4 = cv2.bitwise_and(imgBW, imgBW, mask=img3)
    imgLines = cv2.HoughLinesP(img4, 1, np.pi / 180, 20, minLineLength=0, maxLineGap=10)

    for i in range(len(imgLines)):
        for x1, y1, x2, y2 in imgLines[i]:
            cv2.line(img, (x1, y1), (x2, y2), (0, 0, 0), 2)

    return img


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


def find_max_length(contours):
    max_lenth = 0

    for cnt in contours:
        p1, p2 = get_max_distace_point(cnt)
        line_length = ((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2) ** 0.5

        if line_length > max_lenth:
            max_lenth = line_length

    return max_lenth


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


def angle_between_points(a, b):
    arrow_slope = (a[0] - b[0]) / (a[1] - b[1])
    arrow_angle = math.degrees(math.atan(arrow_slope))
    return arrow_angle


def get_arrow_info(arrow_image):
    arrow_info_image = cv2.cvtColor(arrow_image.copy(), cv2.COLOR_GRAY2BGR)
    contours, hierarchy = cv2.findContours(arrow_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if hierarchy is not None:

        max_lenth = find_max_length(contours)

        for cnt in contours:

            blank_image = np.zeros_like(arrow_image)
            cv2.drawContours(blank_image, [cnt], -1, 255, -1)

            point1, point2 = get_max_distace_point(cnt)

            lenght = get_length(point1, point2)

            if lenght == max_lenth:
                cv2.circle(arrow_info_image, point1, 2, (255, 0, 0), 3)
                cv2.circle(arrow_info_image, point2, 2, (255, 0, 0), 3)

                cv2.putText(arrow_info_image, "point 1 : %s" % (str(point1)), point2, cv2.FONT_HERSHEY_PLAIN, 0.8,
                            (0, 0, 255), 1)
                cv2.putText(arrow_info_image, "point 2 : %s" % (str(point2)), (point2[0], point2[1] + 20),
                            cv2.FONT_HERSHEY_PLAIN, 0.8, (0, 0, 255), 1)

                return arrow_info_image, point1, point2
    else:
        return None, None


def find_closest_components_length(point, class_objects):
    u_object = 0
    min_length = 1000000000000
    for obj in class_objects:

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
            u_object = obj

    return u_object


def relationship_details_detection(image_nparray, boxes, index, class_comp_id, category, class_object1, class_object2):
    _image, y_min, x_min, y_max, x_max = crop_image_(image_nparray, boxes, index)
    _image = cv2.resize(_image, None, fx=4, fy=5)
    ocr_model = PaddleOCR(lang='en', use_gpu=False)
    result = ocr_model.ocr(_image)
    relationship = Relationship(class_answer=class_comp_id, type=category, x_min=x_min, y_min=y_min,
                                x_max=x_max,
                                y_max=y_max, comp_1=class_object1.id, comp_2=class_object2.id)
    db.session.add(relationship)
    db.session.commit()

    if result is not None:
        relationship_text(_image, result, relationship)


def relationship_text(_image, result, relationship):
    for element in result:
        text = element[1][0]
        box = element[0]
        nlp_ner = spacy.load('ner_models/model-best')
        nlp_output = nlp_ner(text)
        box = np.array(box).astype(np.int32)

        xmin = min(box[:, 0])
        ymin = min(box[:, 1])
        xmax = max(box[:, 0])
        ymax = max(box[:, 1])
        for token in nlp_output.ents:

            if token.label_ == 'MULTIPLICITY' or contains_number(text):
                multiplicity = Multiplicity(value=token.text, relationship_id=relationship.id, x_min=xmin,
                                            y_min=ymin, x_max=xmax, y_max=ymax)
                db.session.add(multiplicity)
                db.session.commit()

        if not contains_number(text):
            relationship.name = text
            db.session.commit()


# check if string contains any numbers
def contains_number(string):
    return any([char.isdigit() for char in string])


# crop image using boxes & index
def crop_image_(image, boxes, index):
    height, width, c = image.shape
    ymin = boxes[index][0] * height
    xmin = boxes[index][1] * width
    ymax = boxes[index][2] * height
    xmax = boxes[index][3] * width

    cropped_image = image[int(ymin):int(ymax), int(xmin):int(xmax)]

    # returns cropped image , ymin,xmin,ymax & xmax
    return cropped_image, ymin, xmin, ymax, xmax
