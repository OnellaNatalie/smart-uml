import operator
import re

import cv2
import numpy as np
import pytesseract as ts
from PIL import Image

from object_detection.utils import label_map_util

import app
import tensorflow as tf

from config.database import db


def class_object_detection(model_path, label_path, image_path):
    detect_fn = tf.saved_model.load(model_path)
    category_index = label_map_util.create_category_index_from_labelmap(label_path, use_display_name=True)
    image_np = np.array(Image.open(image_path))
    input_tensor = tf.convert_to_tensor(image_np)

    input_tensor = input_tensor[tf.newaxis, ...]

    detections = detect_fn(input_tensor)

    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                  for key, value in detections.items()}
    detections['num_detections'] = num_detections

    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

    accurate_indexes = [k for k, v in enumerate(detections['detection_scores']) if (v > 0.6)]
    num_entities = len(accurate_indexes)

    class_id = operator.itemgetter(*accurate_indexes)(detections['detection_classes'])
    boxes = detections['detection_boxes']
    return boxes, num_entities, accurate_indexes, num_entities, category_index, class_id


def component_separation(filename, class_comp_id):
    mdl1_path = app.CLASS_SAVED_MODEL_PATH
    lbl1_path = app.CLASS_SAVED_LABEL_PATH
    img1_path = app.SUBMISSION_PATH_CLASS + '/' + filename
    boxes, num_entities, accurate_indexes, num_entities, category_index, class_id = class_object_detection(mdl1_path,
                                                                                                           lbl1_path,
                                                                                                           img1_path)

    # Convert the class id in their name
    if num_entities > 0:
        for index in range(0, len(accurate_indexes)):

            if category_index[class_id[index]]['name'] == 'class' or category_index[class_id]['name'] == 'interface':
                class_details_detection(filename, boxes, index)


def crop_and_image_resolution(path, boxes, index):
    image = cv2.imread(path)
    height, width, c = image.shape
    # crop box format: xmin, ymin, xmax, ymax
    ymin = boxes[index][0] * height
    xmin = boxes[index][1] * width
    ymax = boxes[index][2] * height
    xmax = boxes[index][3] * width

    cropped_image = image[int(ymin):int(ymax), int(xmin):int(xmax)]
    image = cv2.imwrite('image.jpg' + index, cropped_image)
    # convert values to int
    black = (0, 0, 0)
    white = (255, 255, 255)
    threshold = (160, 160, 160)

    # Open input image in grayscale mode and get its pixels.
    img = Image.open("image.jpg").convert("LA")
    pixels = img.getdata()

    new_pixels = []

    # Compare each pixel
    for pixel in pixels:
        if pixel < threshold:
            new_pixels.append(black)
        else:
            new_pixels.append(white)

    # Create and save new image.
    new_img = Image.new("RGB", img.size)
    new_img.putdata(new_pixels)

    return image


def text_extraction(image):
    config = ('-l eng --oem 1 --psm 4')
    text = ts.image_to_string(image, config=config)
    return text


def class_details_detection(filename, boxes, index):
    _image = crop_and_image_resolution(filename, boxes, index)
    cv2.imwrite(app.SUBMISSION_PATH_CLASS + '/' + "class" + str(index), _image)
    mdl2_path = app.CLASS_COMP_SAVED_MODEL_PATH
    lbl2_path = app.CLASS_COMP_SAVED_LABEL_PATH
    img2_path = app.SUBMISSION_PATH_CLASS + '/' + "class" + str(index)
    boxes_class, num_entities, accurate_indexes, num_entities, category_index, class_id = class_object_detection(
        mdl2_path, lbl2_path, img2_path)

    for j in range(0, len(accurate_indexes)):
        if category_index[class_id[j]]['name'] == 'class_attributes':
            class_attributes = crop_and_image_resolution(img2_path, boxes_class, j)
            text_extraction(class_attributes)
        elif category_index[class_id[j]]['name'] == 'class_methods':
            class_methods = crop_and_image_resolution(img2_path, boxes_class, j)
            text_extraction(class_methods)
        