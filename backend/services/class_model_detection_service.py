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


def class_object_detection(filename, class_comp_id, model_path, label_path, image_path):
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
    boxes, num_entities, accurate_indexes, num_entities, category_index, class_id = class_object_detection(filename,
                                                                                                           class_comp_id,
                                                                                                           app.CLASS_SAVED_MODEL_PATH,
                                                                                                           app.CLASS_SAVED_LABEL_PATH,
                                                                                                           app.SUBMISSION_PATH_CLASS + '/' + filename)
    # Convert the class id in their name
    if num_entities > 0:
        for i in range(0, len(accurate_indexes)):

            if category_index[class_id]['name'] == 'class':
                class_image = crop_and_image_resolution(filename, boxes)
                cv2.imwrite(app.SUBMISSION_PATH_CLASS, "class" + str(i))
                # boxes,num_entities,accurate_indexes,num_entities,category_index,class_id = class_object_detection(class_image, class_comp_id, app.CLASS_SAVED_MODEL_PATH, app.CLASS_SAVED_LABEL_PATH,app.SUBMISSION_PATH_CLASS+'/'+"class"+str(i))

            elif category_index[class_id]['name'] == 'interface':
                image = crop_and_image_resolution(filename, boxes)


def crop_and_image_resolution(filename, boxes):
    image = cv2.imread(app.SUBMISSION_PATH + '/' + filename)
    height, width, c = image.shape
    # crop box format: xmin, ymin, xmax, ymax
    ymin = boxes[0] * height
    xmin = boxes[1] * width
    ymax = boxes[2] * height
    xmax = boxes[3] * width

    cropped_image = image[int(ymin):int(ymax), int(xmin):int(xmax)]
    image = cv2.imwrite('image.jpg', cropped_image)
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
