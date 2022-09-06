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

def model_object_detection(filename, class_id):
    detect_fn = tf.saved_model.load(app.CLASS_SAVED_MODEL_PATH)
    category_index = label_map_util.create_category_index_from_labelmap(
        app.CLASS_SAVED_LABEL_PATH + "/label_map.pbtxt",
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
    text_extraction(filename, class_id, boxes, accurate_indexes, category_index, class_id)