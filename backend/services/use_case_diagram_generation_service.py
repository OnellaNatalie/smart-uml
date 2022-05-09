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

def generate_dot_file_actors_string(actors):
    actors_string_content = []
    for actor in actors:
        single_actor_string = 'subgraph ' + actor + ' {label="' + actor + '"; ' + actor.lower() + '};\n\t' +  actor.lower() + ' [image="'+APP_ROOT+'/stick.png";peripheries=0;];\n'
        actors_string_content.append(single_actor_string)
    return actors_string_content

def generate_use_case_nodes(actors_and_use_cases_array):
    use_case_nodes_array = []
    for element in actors_and_use_cases_array:
        cleaned_use_case_string = clean_use_case_strings(element[1])
        use_case_string = cleaned_use_case_string.lower().replace(' ','_') + ' [label="' + cleaned_use_case_string + '"];\n'
        use_case_nodes_array.append(use_case_string)
    return use_case_nodes_array

def generate_edges(actors_and_use_cases_array):
    edges_array = []
    for element in actors_and_use_cases_array:
        cleaned_string = clean_use_case_strings(element[1])
        edge_string = element[0].replace(' ','').lower() + '->' + cleaned_string.lower().replace(' ','_') + ';\n'
        edges_array.append(edge_string)
    return edges_array


def generate_extend_relationships_string(extracted_relationships):
    extend_array = []
    for element in extracted_relationships:
        if element['extend']:
            for ele in element['extend']:
                extend_string = element['use_case'].lstrip(' ').rstrip(' ').replace(' ','_').lower() + '->' + ele.lstrip(' ').rstrip(' ').replace(' ','_').lower() + ';\n'
                extend_array.append(extend_string)
    return extend_array

def generate_include_relationships_string(extracted_relationships):
    include_array = []
    for element in extracted_relationships:
        if element['include']:
            for ele in element['include']:
                include_string = element['use_case'].lstrip(' ').rstrip(' ').replace(' ','_').lower() + "->" + ele.lstrip(' ').rstrip(' ').replace(' ','_').lower() + ';\n'
                include_array.append(include_string)
    return include_array

def generate_random_string():
    letters = string.ascii_lowercase
    random_string = ''.join(random.choice(letters) for i in range(10))
    return random_string

def generate_use_case_diagram(actors,extracted_relationships,actors_and_use_cases_array):
    generated_actors_string = generate_dot_file_actors_string(actors)
    generated_use_case_nodes_string = generate_use_case_nodes(actors_and_use_cases_array)
    generated_edges_string = generate_edges(actors_and_use_cases_array)
    generated_extend_relationships_string = generate_extend_relationships_string(extracted_relationships)
    generated_include_relationships_string = generate_include_relationships_string(extracted_relationships)

    dot_file_name = generate_random_string()
    dot_file = open(OUTPUTS_GENERATED_DOT_FILES_PATH + "/use_cases_" + dot_file_name + ".dot", "x")

    dot_file_begining_string = 'digraph G {\n\t' + 'rankdir=LR;\n\t' + 'labelloc="b";\n\t' + 'peripheries=0;\n\n'
    dot_file.write(dot_file_begining_string)

    dot_file.write('\t' + 'node [shape=plaintext]' + '\n\n')
    for generated_string in generated_actors_string:
        dot_file.write('\t' + generated_string + '\n')

    dot_file.write('\t' + 'node [shape=ellipse, style=solid];' + '\n\n')
    for generated_use_cases in generated_use_case_nodes_string:
        dot_file.write("\t" + generated_use_cases)

    dot_file.write('\n\t' + 'edge [arrowhead="none"];' + '\n\n')
    for generated_edge in generated_edges_string:
        dot_file.write("\t" + generated_edge)

    dot_file.write('\n\t' + 'edge [arrowtail="vee", label="<<extend>>", style=dashed];' + '\n\n')
    for generated_extend in generated_extend_relationships_string:
        dot_file.write("\t" + generated_extend)

    dot_file.write('\n\t' + 'edge [arrowtail="vee", label="<<include>>", style=dashed];' + '\n\n')
    for generated_include in generated_include_relationships_string:
        dot_file.write("\t" + generated_include)

    dot_file.write('\n' + '}')
    dot_file.close()

    generate_diagram(dot_file_name)
    return '/generated_use_case_diagrams/' + dot_file_name + '.png'

def generate_diagram(filename):
    subprocess.run(["dot", "-Tpng", OUTPUTS_GENERATED_DOT_FILES_PATH+"/use_cases_"+filename+".dot", "-o", OUTPUTS_GENERATED_USE_CASE_DIAGRAMS_PATH+"/"+filename+".png"])
    return True