import operator
import os
import re

import cv2
import numpy as np
import pytesseract as ts
from PIL import Image
from models.attribute_model import Attribute

from object_detection.utils import label_map_util

import app
import tensorflow as tf
import spacy

from config.database import db
from models.component_model import Component
from models.interface_model import Interface
from models.method_model import Method

ts.pytesseract.tesseract_cmd = r'C:\Users\DELL\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'


def component_separation(filename, class_comp_id):
    mdl1_path = app.CLASS_SAVED_MODEL_PATH
    lbl1_path = app.CLASS_SAVED_LABEL_PATH
    img1_path = app.SUBMISSION_PATH_CLASS + '/' + filename
    image_nparray = np.array(Image.open(img1_path))

    # print(img1_path)
    boxes, num_entities, accurate_indexes, num_entities, category_index, class_id = class_object_detection(mdl1_path,
                                                                                                           lbl1_path,
                                                                                                           image_nparray)

    # Convert the class id in their name
    if num_entities > 0:
        for index in range(0, len(accurate_indexes)):
            if category_index[class_id[index]]['name'] == 'class':
                print(filename)
                _image = crop_image_(image_nparray, boxes, index)
                _image = cv2.resize(_image, None, fx=2, fy=2)
                class_details_detection(_image, class_comp_id)

            elif category_index[class_id[index]]['name'] == 'interface':
                _image = crop_image_(image_nparray, boxes, index)
                _image = cv2.resize(_image, None, fx=2, fy=2)
                class_details_detection(_image, class_comp_id)


def class_object_detection(model_path, label_path, image_nparray):
    detect_fn = tf.saved_model.load(model_path)
    category_index = label_map_util.create_category_index_from_labelmap(label_path, use_display_name=True)
    image_np = image_nparray
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


def class_details_detection(_image, class_comp_id):
    class_names = []
    attributes = []
    methods = []

    mdl2_path = app.CLASS_COMP_SAVED_MODEL_PATH
    lbl2_path = app.CLASS_COMP_SAVED_LABEL_PATH
    boxes_class, num_entities, accurate_indexes, num_entities, category_index, class_id = class_object_detection(
        mdl2_path, lbl2_path, _image)

    if num_entities > 1:
        for j in range(0, len(accurate_indexes)):
            if category_index[class_id[j]]['name'] == 'class_attributes':
                attr_removed = crop_and_hide(_image, boxes_class, j)
                class_names.append(attr_removed)
                class_attributes = crop_image_(_image, boxes_class, j)
                text = text_extraction(class_attributes)
                attribute = save_attributes_methods(text, 'attribute')
                attributes.append(attribute)

            elif category_index[class_id[j]]['name'] == 'class_methods':
                class_methods = crop_image_(_image, boxes_class, j)
                text = text_extraction(class_methods)
                print(text)
                method_removed = crop_and_hide(class_names[0], boxes_class, j)
                class_name = text_extraction(method_removed)
                method = save_attributes_methods(text, 'method')
                methods.append(method)
                if ''.join(class_name) != '':
                    if "interface" in ''.join(class_name):
                        name = ''.join(class_name).replace("<<interface>>", "")
                        comp = Component(class_answer=class_comp_id, name=name, type="interface")
                    else:
                        name = ''.join(class_name)
                        comp = Component(class_answer=class_comp_id, name=name, type="class")

                    db.session.add(comp)
                    db.session.commit()
                    alter_attributes_methods(methods, comp.id)
                    class_names.clear()


def crop_image_(image, boxes, index):
    # image = cv2.imread(path)
    height, width, c = image.shape
    # crop box format: xmin, ymin, xmax, ymax
    ymin = boxes[index][0] * height
    xmin = boxes[index][1] * width
    ymax = boxes[index][2] * height
    xmax = boxes[index][3] * width

    cropped_image = image[int(ymin):int(ymax), int(xmin):int(xmax)]
    # image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
    # image = cv2.resize(image, (800, 500))

    return cropped_image


def text_extraction(image):
    config = '-l eng --oem 1 --psm 4'
    text = ts.image_to_string(image, config=config)
    text = text.splitlines()
    text = [x.strip(' ') for x in text]
    text = list(filter(None, text))
    return text


def save_attributes_methods(text, typ):
    nlp = spacy.load('en_core_web_sm')
    for element in text:
        access = covert_to_access_specifier(element)
        removable = str.maketrans('', '', '()')
        nlp_output = list(filter(None, nlp(element.translate(removable))))
        for token in nlp_output:
            if token.text == ':':
                previous_index = nlp_output.index(token) - 1
                next_index = nlp_output.index(token) + 1
                if typ == 'attribute':
                    attr = Attribute(data_type=nlp_output[next_index], name=nlp_output[previous_index],
                                     access_spec=access)
                    db.session.add(attr)
                    db.session.commit()
                    return attr

                else:
                    method = Method(return_type=nlp_output[next_index], name=nlp_output[previous_index],
                                    access_spec=access)
                    db.session.add(method)
                    db.session.commit()
                    return method


def alter_attributes_methods(element_list, class_id):
    for element in element_list:
        element.class_id = class_id
        db.session.commit()


def covert_to_access_specifier(access):
    if access.startswith('-'):
        return "Private"

    elif access.startswith('#'):
        return "Protected"

    if access.startswith('+'):
        return "Public"

    elif access.startswith('~'):
        return "Package"

    else:
        return ''


def crop_and_hide(image, boxes, index):
    height, width, c = image.shape
    # crop box format: xmin, ymin, xmax, ymax
    ymin = boxes[index][0] * height
    xmin = boxes[index][1] * width
    ymax = boxes[index][2] * height
    xmax = boxes[index][3] * width

    image[int(ymin):int(ymax), int(xmin):int(xmax)] = 255

    return image
