import requests
from sqlalchemy import func
from flask import Blueprint, jsonify, request
from constants.http_status_codes_constant import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, \
    HTTP_500_INTERNAL_SERVER_ERROR
from config.database import db
# from datetime import datetime

from models.actor_and_use_case import ActorANDUseCase

from models.extend_relationship import ExtendRelationship

from models.include_relationship import IncludeRelationship

from models.use_case_generalization_relationship import UseCaseGeneralizationRelationship

from models.use_case_association_relationship import UseCaseAssociationRelationship

from models.use_case_answer import UseCaseAnswer

from models.actor_generalization_relationship import ActorGeneralizationRelationship

from services.similarity import similarity_components

use_case_diagram_plagiarism = Blueprint('use_case_diagram_plagiarism', __name__,
                                        url_prefix='/api/v1/use_case_diagram_plagiarism')


@use_case_diagram_plagiarism.get('/similarities')
def get_use_case():

    extent_component = None
    include_component = None
    user_case_association_component = None
    user_cases_generalization_component = None
    actor_generalization_component = None
    actor_association_component = None

    includes = IncludeRelationship.query.all()
    extents = ExtendRelationship.query.all()
    user_cases = ActorANDUseCase.query.all()
    user_case_associations = UseCaseAssociationRelationship.query.all()
    user_cases_generalizations = UseCaseGeneralizationRelationship.query.all()
    actor_generalizations = ActorGeneralizationRelationship.query.all()

    for user_case in user_cases:
        if user_case.type == "use case":
            for extent in extents:
                if user_case.id == extent.connected_component_01:
                    extent_component = user_case
                    similarity_components(extent_component.use_case_answer, extent_component.text)
                    print("Extend component 1 : ", extent_component.text)
                elif user_case.id == extent.connected_component_02:
                    extent_component = user_case
                    similarity_components(extent_component.use_case_answer, extent_component.text)
                    print("Extend component 2 : ", extent_component.text)

            for include in includes:
                if user_case.id == include.connected_component_01:
                    include_component = user_case
                    similarity_components(include_component.use_case_answer, include_component.text)
                    print("Include component 1 : ", include_component.text)
                elif user_case.id == include.connected_component_02:
                    include_component = user_case
                    similarity_components(include_component.use_case_answer, include_component.text)
                    print("Include component 2 : ", include_component.text)

            for user_case_association in user_case_associations:
                if user_case.id == user_case_association.connected_component_01:
                    user_case_association_component = user_case
                    similarity_components(user_case_association_component.use_case_answer,
                                          user_case_association_component.text)
                    print("User cases association component 1 : ", user_case_association_component.text)
                elif user_case.id == user_case_association.connected_component_02:
                    user_case_association_component = user_case
                    similarity_components(user_case_association_component.use_case_answer,
                                          user_case_association_component.text)
                    print("User cases association component 2 : ", user_case_association_component.text)

            for user_cases_generalization in user_cases_generalizations:
                if user_case.id == user_cases_generalization.connected_component_01:
                    user_cases_generalization_component = user_case
                    similarity_components(user_cases_generalization_component.use_case_answer,
                                          user_cases_generalization_component.text)
                    print("User cases generalization Component 1 :  ", user_cases_generalization_component.text)
                elif user_case.id == user_cases_generalization.connected_component_02:
                    user_cases_generalization_component = user_case
                    similarity_components(user_cases_generalization_component.use_case_answer,
                                          user_cases_generalization_component.text)
                    print("User cases generalization Component 2 : ", user_cases_generalization_component.text)

        elif user_case.type == "actor":
            for actor_generalization in actor_generalizations:
                if user_case.id == actor_generalization.connected_component_01:
                    actor_generalization_component = user_case
                    similarity_components(actor_generalization_component.use_case_answer,
                                          actor_generalization_component.text)
                    print("Actor generalization component 1 : ", actor_generalization_component.text)
                elif user_case.id == actor_generalization.connected_component_02:
                    actor_generalization_component = user_case
                    similarity_components(actor_generalization_component.use_case_answer,
                                          actor_generalization_component.text)
                    print("Actor generalization component 2 : ", actor_generalization_component.text)


            for actor_association in user_case_associations:
                if user_case.id == actor_association.connected_component_01:
                    actor_association_component = user_case
                    similarity_components(actor_association_component.use_case_answer,
                                          actor_association_component.text)
                    print("Actor association component 1 : ", actor_association_component.text)
                elif user_case.id == actor_association.connected_component_02:
                    actor_association_component = user_case
                    similarity_components(actor_association_component.use_case_answer,
                                          actor_association_component.text)
                    print("Actor association component 2 : ", actor_association_component.text)

    return jsonify({"Message": "Success"}), HTTP_200_OK


@use_case_diagram_plagiarism.get('/use_case_plagiarism_percentage')
def get_actor():
    user_cases = ActorANDUseCase.query.all()
    use_case_answers = UseCaseAnswer.query.all()

    all_count = db.session.query(ActorANDUseCase.use_case_answer,
                                 func.count(ActorANDUseCase.use_case_answer)).group_by(
        ActorANDUseCase.use_case_answer).all()

    actor_similarity = db.session.query(ActorANDUseCase.use_case_answer,
                                        func.count(ActorANDUseCase.plagiarism_count)).filter_by(
        plagiarism_count=1).group_by(
        ActorANDUseCase.use_case_answer).all()

    for use_case_answer in use_case_answers:
        print(use_case_answer.id)
        counter = 0
        counter1 = 0

        for user_case in user_cases:
            if user_case.use_case_answer == use_case_answer.id:
                counter += 1
                if user_case.plagiarism_count == "1":
                    counter1 += 1
        print("All use cases and actors count :", counter)
        print("similarity count :", counter1)
        if counter != 0:
            plagirism_count = counter1/counter * 100
            print("Plagiarism Percentage :", plagirism_count)






    return jsonify({"Message": "Success"}), HTTP_200_OK
