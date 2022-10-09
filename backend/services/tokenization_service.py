import re
import spacy


def get_ner(sentence):
    print(sentence)
    ents = list(sentence.ents)
    return ents


def get_pos(sentence):
    for token in sentence:
        print(token.text, token.pos_)


def get_noun_chunks(sentence):
    return list(sentence.noun_chunks)


# getting nouns and pronouns (pos tagging)
def get_nouns_pronouns(sentence):
    for token in sentence:
        if token.pos_ == "PROPN" and token.pos_ is not None:
            return token


def remove_punctuation(sentence):
    text_no_punct = [token for token in sentence if not token.is_punct]
    cleaned_sentence = ' '.join(token.text for token in text_no_punct)
    return cleaned_sentence


def split_actions(sentence):
    split_string = "should be able to "
    if split_string in sentence:
        extracted_string = sentence.split(split_string)
        return extracted_string


def get_actions(splitted_action):
    temp_array = []
    if splitted_action is not None and '|' in splitted_action[1]:
        res = splitted_action[1].split(' | ')
        # print('res',res)
        temp_array.append(splitted_action[0])
        temp_array.append(res[0])
        return temp_array
    else:
        return splitted_action


def get_sentences(text):
    nlp = spacy.load("en_core_web_lg")
    doc = nlp(text)
    sentences = list(doc.sents)
    cleaned = []
    for sentence in sentences:
        flag = False
        token_count = 0
        for token in sentence:
            token_count = token_count + 1
            if token.pos_ == 'INTJ' or token.text == '?' or (token.text == 'I' and token.pos_ == 'PRON') or (
                    token.text == '’m' and token.pos_ == 'VERB') or (
                    (token.text == 'what' or token.text == 'What') and token.pos_ == 'PRON') or (
                    (token.text == 'We' or token.text == 'we') and token.pos_ == 'PRON') or (
                    (token.text == 'You' or token.text == 'you') and token.pos_ == 'PRON'):
                flag = True
        if token_count < 6:
            flag = True
        if flag is False:
            cleaned.append(sentence)

    # print(cleaned)
    cleaned = [re.sub(
        r"^Speaker.*[\u002D\u058A\u05BE\u1400\u1806\u2010-\u2015\u2E17\u2E1A\u2E3A\u2E3B\u2E40\u301C\u3030\u30A0\uFE31\uFE32\uFE58\uFE63\uFF0D]",
        "", str(x)).strip() for x in cleaned]
    cleaned = list(filter(None, cleaned))
    return cleaned

# def get_actions(sentence):
#     split_string = "should be able to "
#     print(sentence)
#     print(split_string)
#     if split_string in sentence:
#         extracted_string = sentence.split(split_string)
#         if '|' in extracted_string[1]:
#            res = extracted_string[1].split(' | ')
#            print(res)
#            return res[0]
#         else:
#             return extracted_string
#
#
#
# def create_token_based_array(sentences,cleaned_extracted_actions):
#     print('PROCESSING : create_token_based_array')
#     print("######## ",sentences)
#     for single_extracted_actions_element in cleaned_extracted_actions:
#         print(single_extracted_actions_element)
#
#
# def identify_matching_tokens(cleaned_sentences,tokenize_array):
#     print('PROCESSING : identify_matching_tokens')
#     print(cleaned_sentences)
#     for sentence in cleaned_sentences:
#         for token in sentence:
#             for single_array_element in tokenize_array:
#                 extract_matching_tokens(token,single_array_element,sentence)
#     return True
#
# def extract_matching_tokens(token,tokenize_array,sentence):
#     print('PROCESSING : extract_matching_tokens')
#     for single_token in tokenize_array:
#         print('TOKEN : ',token, ' ST : ',single_token)
#         if token is single_token:
#             print('TOKEN : ',token, ' SENTENCE : ', sentence)
#     return True
