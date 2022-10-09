from services.tokenization_service import *
from services.class_diagram_generation_service import *
from services.use_case_diagram_generation_service import *


# removing unwanted spaces
def remove_unwanted_values(data):
    remove_element = 'None'
    if remove_element in data:
        data.pop(data.index(remove_element))
    return data


# punctuation removing
def remove_punctuation(sentence):
    text_without_punctuation = [token for token in sentence if not token.is_punct]
    cleaned_sentence = ' '.join(token.text for token in text_without_punctuation)
    return cleaned_sentence


# load the text content and generating diagrams
def main(scenario, assignment_type):
    # replacing spaces and new line characters
    text_content = scenario.replace("\n\n", " ").replace("\n", " ")
    nlp = spacy.load("en_core_web_lg")
    nlp_loaded_text_content = nlp(text_content)

    # sentences splitting
    sentences = list(nlp_loaded_text_content.sents)
    # removing fist and last sentences
    sentences.pop(0)
    del sentences[-1]

    # creating required lists
    nouns_pronouns = []
    cleaned_extracted_actions = []
    cleaned_sentences = []
    splitted_actions_and_actor_array = []

    # looping through each sentence
    for sentence in sentences:
        # getting actors using nouns pronouns
        res = get_nouns_pronouns(sentence)
        nouns_pronouns.append(str(res))
        cleaned_sentence = remove_punctuation(sentence)
        cleaned_sentences.append(cleaned_sentence)

        splitted_actions_and_actor = split_actions(str(cleaned_sentence))
        splitted_actions_and_actor_array.append(splitted_actions_and_actor)

        extracted_actions = get_actions(splitted_actions_and_actor)

        if extracted_actions is not None:
            cleaned_extracted_actions.append(extracted_actions)

    # remove duplicates of the actors
    nouns_pronouns = list(dict.fromkeys(nouns_pronouns))
    actors = remove_unwanted_values(nouns_pronouns)

    extracted_relationships = get_include_extend_relationships(splitted_actions_and_actor_array)
    actors_and_use_cases_array = identify_use_cases(cleaned_extracted_actions)

    if assignment_type == 1:
        generated_usecase_diagram_path = generate_use_case_diagram(actors, extracted_relationships,
                                                                   actors_and_use_cases_array)
        return generated_usecase_diagram_path

    elif assignment_type == 2:
        generated_class_diagram_path = generate_class(actors, cleaned_extracted_actions)
        return generated_class_diagram_path

    elif assignment_type == 3:
        generated_class_diagram_path = generate_class(actors, cleaned_extracted_actions)
        generated_usecase_diagram_path = generate_use_case_diagram(actors, extracted_relationships,
                                                                   actors_and_use_cases_array)
        return generated_class_diagram_path, generated_usecase_diagram_path
