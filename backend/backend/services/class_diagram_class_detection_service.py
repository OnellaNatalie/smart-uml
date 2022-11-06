import operator
import cv2
import numpy as np
import pytesseract as ts
from PIL import Image
from models.attribute_model import Attribute
from object_detection.utils import label_map_util
import matplotlib.pyplot as plt
import app
import tensorflow as tf
import spacy

from config.database import db
from models.class_component_model import Component
from models.class_relationship_model import Relationship
from models.class_relationship_muplicity import Multiplicity
from models.method_model import Method
from services.class_relationship_relativity_service import detect_class_relationship

ts.pytesseract.tesseract_cmd = r'C:\Users\DELL\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'


def component_separation(filename, class_comp_id):
    """
    detect class diagram component predictions from SSD model & direct the components to correct method
    :param filename: name of the submitted image file
    :param class_comp_id: ID of the submission
    """
    mdl1_path = app.CLASS_SAVED_MODEL_PATH
    lbl1_path = app.CLASS_SAVED_LABEL_PATH
    img1_path = app.SUBMISSION_PATH_CLASS + '/' + filename
    image_nparray = np.array(Image.open(img1_path))

    boxes, accurate_indexes, category_index, class_id = class_object_detection(mdl1_path,
                                                                               lbl1_path,
                                                                               image_nparray)

    for index in range(0, len(accurate_indexes)):
        # get the category name of the component
        if len(accurate_indexes) > 1:
            category = category_index[class_id[index]]['name']

        elif len(accurate_indexes) == 1:
            category = category_index[class_id]['name']

        if category == 'class':
            class_details_detection(image_nparray, boxes, index, class_comp_id, category)

        elif category == 'interface':
            class_details_detection(image_nparray, boxes, index, class_comp_id, category)

        else:
            detect_class_relationship(image_nparray, boxes, index, class_comp_id, category)
            # relationship_details_detection(image_nparray, boxes, index, class_comp_id, category)


def class_object_detection(model_path, label_path, image_nparray):
    """
     do predictions using trained models
    :param model_path: path to the saved model
    :param label_path: path to the label_map.pbtxt
    :param image_nparray: numpy array for image
    :return: prediction details
    """
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


def class_details_detection(image_nparray, boxes, index, class_comp_id, class_type):
    """
    detect class or interface details(name, methods & attributes) and save them in the database
    :param image_nparray: numpy array for cropped classes or interfaces
    :param boxes: coordinates of detected components
    :param index: index of the loop in component_separation method
    :param class_comp_id: ID of the submission
    :param class_type: whether the component a class or interface
    """
    methods_attributes = []

    _image, cl_ymin, cl_xmin, cl_ymax, cl_xmax = crop_image_(image_nparray, boxes, index)

    mdl2_path = app.CLASS_COMP_SAVED_MODEL_PATH
    lbl2_path = app.CLASS_COMP_SAVED_LABEL_PATH
    boxes_class, accurate_indexes, category_index, class_id = class_object_detection(
        mdl2_path, lbl2_path, _image)

    for j in range(0, len(accurate_indexes)):
        if len(accurate_indexes) > 1:
            category = category_index[class_id[j]]['name']

        else:
            category = category_index[class_id]['name']

        if category == 'class_attributes':
            class_attributes, y_min, x_min, y_max, x_max = crop_image_(_image, boxes_class, j)
            class_attributes = cv2.resize(class_attributes, None, fx=2, fy=2)
            text = text_extraction(class_attributes)
            attr = save_attributes_methods(text, 'attribute')
            methods_attributes.append(attr)

        elif category == 'class_methods':
            class_methods, y_min, x_min, y_max, x_max = crop_image_(_image, boxes_class, j)
            class_methods = cv2.resize(class_methods, None, fx=2, fy=2)
            text = text_extraction(class_methods)
            methods = save_attributes_methods(text, 'method')
            methods_attributes.append(methods)

    comp_name = class_name_detection(_image, boxes_class, category_index, accurate_indexes, class_id)
    comp = save_class_interface(class_type, comp_name, cl_ymin, cl_xmin, cl_ymax, cl_xmax, class_comp_id)

    alter_attributes_methods(methods_attributes, comp.id)


def crop_image_(image, boxes, index):
    """
    crop image according to the given coordinates
    :param image: numpy array for image
    :param boxes: detection coordinates of predictions
    :param index: index of the loop in component_separation method
    :return: cropped image as numpy array
    """
    height, width, c = image.shape
    ymin = boxes[index][0] * height
    xmin = boxes[index][1] * width
    ymax = boxes[index][2] * height
    xmax = boxes[index][3] * width

    cropped_image = image[int(ymin):int(ymax), int(xmin):int(xmax)]
    return cropped_image, ymin, xmin, ymax, xmax


def text_extraction(image):
    """
    extract text of image component
    :param image: numpy array of image
    :return: extracted text as a list
    """
    config = '-l eng --oem 1 --psm 4'
    text = ts.image_to_string(image, config=config)
    text = text.splitlines()
    text = [x.strip(' ') for x in text]
    text = list(filter(None, text))
    return text


def save_attributes_methods(text, typ):
    """
    detect attribute or method component and save them inside database
    :param text: list of text
    :param typ: type of object(attribute or method)
    :return: all saved attributes and methods
    """
    saved_data = []
    for element in text:
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
            db.session.add(attr)
            db.session.commit()
            saved_data.append(attr)

        else:
            db.session.add(method)
            db.session.commit()
            saved_data.append(method)

    return saved_data


def alter_attributes_methods(element_list, component_id):
    """
    Update saved method and attributes with class component ID
    :param element_list: attributes and method as a list
    :param component_id: class ID
    """
    for j in element_list:
        for element in j:
            element.class_id = component_id
            db.session.commit()


def covert_to_access_specifier(access):
    """
    convert access specifier symbols to strings
    :param access: access specifier symbol
    :return: access specifier string
    """
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


def class_name_detection(image, boxes, category_index, accurate_indexes, class_id):
    """
    detect & return class or interface name
    :param image: class or interface component image
    :param boxes: predicted coordinates of methods and attributes
    :param category_index: category index of each component
    :param accurate_indexes:
    :param class_id:
    :return: name of the class or interface
    """
    height, width, c = image.shape

    for i in range(0, len(accurate_indexes)):
        if len(accurate_indexes) > 1:
            category = category_index[class_id[i]]['name']

        else:
            category = category_index[class_id]['name']

        if category != 'interface_name' or category != 'class_name':
            ymin = boxes[i][0] * height
            xmin = boxes[i][1] * width
            ymax = boxes[i][2] * height
            xmax = boxes[i][3] * width

            cv2.rectangle(image, (int(xmin), int(ymin)), (int(xmax), int(ymax)), (255, 255, 255), -1)

    class_name = text_extraction(image)
    if ''.join(class_name) is not None:
        if "interface" in ''.join(class_name):
            name = ''.join(class_name).replace("<<interface>>", "")
        else:
            name = ''.join(class_name)

        return name


def save_class_interface(class_type, comp_name, cl_ymin, cl_xmin, cl_ymax, cl_xmax, class_comp_id):
    """
    save class component and interface components in database
    :param class_type: type of component (interface or class)
    :param comp_name: name of interface or class
    :param cl_ymin:
    :param cl_xmin:
    :param cl_ymax:
    :param cl_xmax:
    :param class_comp_id: submission ID of diagram
    :return: database saved object
    """
    comp = Component(class_answer=class_comp_id, name=comp_name, type=class_type, x_min=cl_xmin, y_min=cl_ymin,
                     x_max=cl_xmax,
                     y_max=cl_ymax)
    db.session.add(comp)
    db.session.commit()
    return comp
