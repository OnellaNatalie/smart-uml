from models.actor_and_use_case import ActorANDUseCase

from config.database import db


def similarity_components(use_case_answer, use_case_text):
    user_cases = ActorANDUseCase.query.all()
    for use_case1 in user_cases:
        if use_case1.use_case_answer != use_case_answer and use_case1.text == use_case_text:
            use_case1.plagiarism_count = 1

            db.session.add(use_case1)
            db.session.commit()
