import spacy
import os
from services.tokenization_service import *
from services.class_diagram_generation_service import *
from services.use_case_diagram_generation_service import *
from app import UPLOADS_FOLDER_PATH


def remove_unwanted_values(data):
    remove_element = 'None'
    if remove_element in data:
        data.pop(data.index(remove_element))
    return data


# removing duplicates
def remove_duplicates(data):
    return list(set(data))


# punctuation removal
def remove_punctuation(sentence):
    text_no_punct = [token for token in sentence if not token.is_punct]
    cleaned_sentence = ' '.join(token.text for token in text_no_punct)
    return cleaned_sentence



