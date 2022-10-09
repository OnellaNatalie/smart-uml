import operator
import re

import cv2
import numpy as np
import pytesseract as pytesseract
from PIL import Image

from object_detection.utils import label_map_util

import app
import tensorflow as tf

from config.database import db
from models.actor_and_use_case import ActorANDUseCase

# pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
from services.extend_include_relationship_detection_service import detect_extend_include_relationship
from services.generalization_relationship_detection_service import detect_generalization_relationship


def model_object_detection(filename, use_case_id):
    detect_fn = tf.saved_model.load(app.USE_CASE_SAVED_MODEL_PATH)
    category_index = label_map_util.create_category_index_from_labelmap(
        app.USE_CASE_SAVED_LABEL_PATH + "/label_map.pbtxt",
        use_display_name=True)
    image_np = np.array(Image.open(app.SUBMISSION_PATH + '/' + filename))
    input_tensor = tf.convert_to_tensor(image_np)

    input_tensor = input_tensor[tf.newaxis, ...]

    detections = detect_fn(input_tensor)

    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                  for key, value in detections.items()}
    detections['num_detections'] = num_detections

    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

    accurate_indexes = [k for k, v in enumerate(detections['detection_scores']) if (v > 0.4)]

    class_id = operator.itemgetter(*accurate_indexes)(detections['detection_classes'])
    boxes = detections['detection_boxes']
    text_extraction(filename, class_id, boxes, accurate_indexes, category_index, use_case_id)
    detect_generalization_relationship(filename, boxes, accurate_indexes, use_case_id)
    detect_extend_include_relationship(filename, boxes, accurate_indexes, use_case_id, category_index, class_id)


def text_extraction(filename, class_id, boxes, accurate_indexes, category_index, use_case_id):
    image = cv2.imread(app.SUBMISSION_PATH + '/' + filename)
    for i in range(0, len(accurate_indexes)):
        if category_index[class_id[i]]['name'] != "relationship":
            height, width, c = image.shape

            ymin = boxes[i][0] * height
            xmin = boxes[i][1] * width
            ymax = boxes[i][2] * height
            xmax = boxes[i][3] * width

            crop_img = image[int(ymin):int(ymax), int(xmin):int(xmax)]
            gray_img = cv2.cvtColor(crop_img, cv2.COLOR_BGR2GRAY)
            thresh, bw_img = cv2.threshold(gray_img, 160, 255, cv2.THRESH_TOZERO)
            resize_img = cv2.resize(bw_img, None, fx=1, fy=1)
            ocr_result = pytesseract.image_to_string(resize_img, config='1 eng --oem 1 --psm 13')
            result = ocr_result.strip().replace("\\", "")
            text = re.sub("=|,", "", result)

            if category_index[class_id[i]]['name'] == 'actor':
                actor_obj = ActorANDUseCase(use_case_answer=use_case_id, type='actor', text=text, x_min=xmin,
                                            y_min=ymin, x_max=xmax,
                                            y_max=ymax)
                db.session.add(actor_obj)
                db.session.commit()
            else:
                use_case_obj = ActorANDUseCase(use_case_answer=use_case_id, type='use case', text=text, x_min=xmin,
                                               y_min=ymin, x_max=xmax,
                                               y_max=ymax)
                db.session.add(use_case_obj)
                db.session.commit()


