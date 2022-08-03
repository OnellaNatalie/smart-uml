import random
import string
import subprocess
import shutil
import os

from app import OUTPUTS_GENERATED_DOT_FILES_PATH, OUTPUTS_GENERATED_CLASS_DIAGRAMS_PATH, \
    OUTPUTS_GENERATED_CLASS_FILES_PATH, APP_ROOT


def generate_random_string():
    letters = string.ascii_lowercase
    random_string = ''.join(random.choice(letters) for i in range(10))
    return random_string


def remove_duplicate_class_names(data):
    return list(dict.fromkeys(data))


def generate_class_string_array(actors, data):
    class_content = []
    for actor in actors:
        single_class = []
        for d in data:
            if d[0] == actor:
                class_name_string = "class " + actor + ": \n\t\n"
                class_methods_string = "\t def " + d[1] + "(self): \n\t\t pass \n\n"
                single_class.extend((class_name_string, class_methods_string))
        cleaned_class = remove_duplicate_class_names(single_class)
        class_content.append(cleaned_class)
    return class_content


def create_class_methods(data):
    cleaned_data = []
    for element in data:
        cleaned_array = []
        class_name = element[0].strip()
        method_name = element[1].replace(" ", "_")
        cleaned_array.extend((class_name, method_name))
        cleaned_data.append(cleaned_array)
    return cleaned_data


def generate_diagram(filename):
    try:
        subprocess.run(["pyreverse", "-S", "-o", "dot", "-p", filename, OUTPUTS_GENERATED_CLASS_FILES_PATH+"/"+filename+".py"])
        shutil.move("classes_" + filename + ".dot", OUTPUTS_GENERATED_DOT_FILES_PATH)
        subprocess.run(["dot", "-Tpng", OUTPUTS_GENERATED_DOT_FILES_PATH+"/classes_"+filename+".dot", "-o", OUTPUTS_GENERATED_CLASS_DIAGRAMS_PATH+"/"+filename+".png"])

    except Exception:
        print(Exception)


# generate python file for the class
def generate_class(actors, data):
    res = create_class_methods(data)
    class_string_arr = generate_class_string_array(actors, res)
    python_class_file_name = generate_random_string()
    class_file = open(OUTPUTS_GENERATED_CLASS_FILES_PATH + "/" + python_class_file_name + ".py", "x")
    for single_class_string in class_string_arr:
        for single_string in single_class_string:
            class_file.write(single_string)
        class_file.write("\n\n")
    class_file.close()
    generate_diagram(python_class_file_name)
    return '/generated_class_diagrams/' + python_class_file_name + '.png'
