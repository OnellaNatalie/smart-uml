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


def get_include_extend_relationships(splitted_actions_array):
    relationship_array = []
    for splitted_action in splitted_actions_array:
        dictionary = {}
        if splitted_action is not None and '|' in splitted_action[1]:
            results = splitted_action[1].split('|')
            dictionary = {'use_case': results[0].title(), 'extend': '', 'include': ''}
            for index, result in enumerate(results):
                if 'extend' in result:
                    if '  ' in result:
                        splitted_extends = result.split('  ')
                        for idx, extend in enumerate(splitted_extends):
                            if 'extend' in extend:
                                splitted_extends[idx] = extend.replace('extend', '').title()
                        dictionary['extend'] = splitted_extends
                    else:
                        dictionary['extend'] = [result.replace('extend', '').title()]
                elif 'include' in result:
                    if '  ' in result:
                        splitted_includes = result.split('  ')
                        for idn, include in enumerate(splitted_includes):
                            if 'include' in include:
                                splitted_includes[idn] = include.replace('include', '').title()
                        dictionary['include'] = splitted_includes
                    else:
                        dictionary['include'] = [result.replace('include', '').title()]
        else:
            continue
        relationship_array.append(dictionary)
    return relationship_array
def clean_use_case_strings(use_case):
    if 'Extend' in use_case:
        return use_case.replace('Extend','').lstrip(' ')
    elif 'Include' in use_case:
        return use_case.replace('Include', '').lstrip(' ')
    else:
        return use_case.lstrip(' ')

