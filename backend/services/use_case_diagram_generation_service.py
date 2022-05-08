import random
import string
import subprocess
import os

from app import OUTPUTS_GENERATED_DOT_FILES_PATH, OUTPUTS_GENERATED_CLASS_DIAGRAMS_PATH, \
    OUTPUTS_GENERATED_USE_CASE_DIAGRAMS_PATH, OUTPUTS_GENERATED_CLASS_FILES_PATH, APP_ROOT


def identify_use_cases(cleaned_extracted_actions):
    for extracted_action in cleaned_extracted_actions:
        extracted_action[1] = extracted_action[1].title()
    return cleaned_extracted_actions


