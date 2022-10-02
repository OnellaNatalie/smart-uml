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
from models.method_model import Method

ts.pytesseract.tesseract_cmd = r'C:\Users\DELL\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'


def component_separation(filename, class_comp_id):
    mdl1_path = app.CLASS_SAVED_MODEL_PATH
    lbl1_path = app.CLASS_SAVED_LABEL_PATH
    img1_path = app.SUBMISSION_PATH_CLASS + '/' + filename
    image_nparray = np.array(Image.open(img1_path))

    # print(img1_path)
    boxes, accurate_indexes, category_index, class_id = class_object_detection(mdl1_path,
                                                                               lbl1_path,
                                                                               image_nparray)

    # Convert the class id in their name
    for index in range(0, len(accurate_indexes)):
        if len(accurate_indexes) > 1:
            category = category_index[class_id[index]]['name']

        elif len(accurate_indexes) == 1:
            category = category_index[class_id]['name']
            print(category)

        if category == 'class':
            print(filename)
            _image = crop_image_(image_nparray, boxes, index)
            _image = cv2.resize(_image, None, fx=2, fy=2)
            class_details_detection(_image, class_comp_id)

        elif category == 'interface':
            _image = crop_image_(image_nparray, boxes, index)
            _image = cv2.resize(_image, None, fx=3, fy=3)
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

    accurate_indexes = [k for k, v in enumerate(detections['detection_scores']) if (v > 0.8)]

    class_id = operator.itemgetter(*accurate_indexes)(detections['detection_classes'])
    boxes = detections['detection_boxes']
    return boxes, accurate_indexes, category_index, class_id


def class_details_detection(_image, class_comp_id):
    methods_attributes = []
    mdl2_path = app.CLASS_COMP_SAVED_MODEL_PATH
    lbl2_path = app.CLASS_COMP_SAVED_LABEL_PATH
    boxes_class, accurate_indexes, category_index, class_id = class_object_detection(
        mdl2_path, lbl2_path, _image)

    for j in range(0, len(accurate_indexes)):
        if len(accurate_indexes) > 1:
            category = category_index[class_id[j]]['name']
            print(category_index, 'line 91 category')
            print(class_id, 'line 92 class id')

        else:
            category = category_index[class_id]['name']
            print(category)

        if category == 'class_attributes':
            print(category, 'line 96 - inside attributes')
            print(j, 'line 97 - inside attributes')
            class_attributes = crop_image_(_image, boxes_class, j)
            cv2.imwrite('image.jpg', class_attributes)
            text = text_extraction(class_attributes)
            attr = save_attributes_methods(text, 'attribute')
            methods_attributes.append(attr)

            # alter_attributes_methods(attributes, comp.id)

        elif category == 'class_methods':
            print(category, 'line 103 - inside methods')
            class_methods = crop_image_(_image, boxes_class, j)
            text = text_extraction(class_methods)
            print(text, '108 line')
            methods = save_attributes_methods(text, 'method')
            methods_attributes.append(methods)
            # alter_attributes_methods(methods, comp.id)
            print(text, '111 line')

    comp = class_name_detection(class_comp_id, _image, boxes_class, category_index, accurate_indexes, class_id)
    alter_attributes_methods(methods_attributes, comp.id)


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
    saved_data = []
    nlp = spacy.load('en_core_web_sm')
    for element in text:
        print(element, 'line 145')
        # removable = str.maketrans('', '', '()')
        nlp_ner = spacy.load('ner_models/model-best')
        nlp_output = nlp_ner(element)
        attr = Attribute()
        method = Method()

        for token in nlp_output.ents:

            if typ == 'attribute':
                if token.label_ == 'ATTRIBUTE_NAME':
                    attr.name = token.text

                elif token.label_ == 'ACCESS_SP':
                    attr.access_spec = covert_to_access_specifier(token.text)

                elif token.label_ == 'DATA_TYPE':
                    attr.data_type = token.text

            elif typ == 'method':
                if token.label_ == 'METHOD_NAME':
                    method.name = token.text

                elif token.label_ == 'ACCESS_SP':
                    method.access_spec = covert_to_access_specifier(token.text)

                elif token.label_ == 'DATA_TYPE':
                    method.return_type = token.text

        if typ == 'attribute':
            print(attr, 'line 175 - attr')
            db.session.add(attr)
            db.session.commit()
            saved_data.append(attr)

        else:
            print(method, 'line 181 method')
            db.session.add(method)
            db.session.commit()
            saved_data.append(method)

    return saved_data


def alter_attributes_methods(element_list, class_id):
    for j in element_list:
        for element in j :
            print(class_id)
            print(element_list)
            element.class_id = class_id
            db.session.commit()


def covert_to_access_specifier(access):
    if access == "-":
        return "Private"

    elif access == "#":
        return "Protected"

    if access == "+":
        return "Public"

    elif access == "~":
        return "Package"

    else:
        return ''


def crop_and_hide(image, boxes, category_index, accurate_indexes, class_id):
    print(category_index, 'category_index')

    print(class_id, 'class_id')

    height, width, c = image.shape

    for i in range(0, len(accurate_indexes)):
        if len(accurate_indexes) > 1:
            category = category_index[class_id[i]]['name']

        else:
            category = category_index[class_id]['name']
            print(category, '225 line')

        if category != 'interface_name' or category != 'class_name':
            ymin = boxes[i][0] * height
            xmin = boxes[i][1] * width
            ymax = boxes[i][2] * height
            xmax = boxes[i][3] * width

            cv2.rectangle(image, (int(xmin), int(ymin)), (int(xmax), int(ymax)), (255, 255, 255), -1)
    return image


def class_name_detection(class_comp_id, image, boxes, category_index, accurate_indexes, class_id):
    image = crop_and_hide(image, boxes, category_index, accurate_indexes, class_id)

    class_name = text_extraction(image)
    if ''.join(class_name) != '':
        if "interface" in ''.join(class_name):
            name = ''.join(class_name).replace("<<interface>>", "")
            comp = Component(class_answer=class_comp_id, name=name, type="interface")
        else:
            name = ''.join(class_name)
            comp = Component(class_answer=class_comp_id, name=name, type="class")

        db.session.add(comp)
        db.session.commit()
        return comp
