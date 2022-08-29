import os
from datetime import datetime

from config.database import db
from models.assignment_model import Assignment
from models.class_diagram_answer import ClassAnswer
from models.use_case_answer import UseCaseAnswer

FILE_NAME = str(datetime.now())


def save_submission(assignment_id, image, submission_type, comment, user):
    if submission_type == 'use case':
        image.save(os.path.join('submissions', 'use_case', FILE_NAME))
        assignment = Assignment.query.filter_by(id=assignment_id).first()
        use_case_obj = UseCaseAnswer(user=user, assignment=assignment, file_name=FILE_NAME,
                                     comment=comment)
        db.session.add(use_case_obj)
        db.session.commit()
    else:
        image.save(os.path.join('submissions', 'class', FILE_NAME))
        assignment = Assignment.query.filter_by(id=assignment_id).first()
        class_obj = ClassAnswer(user=user, assignment=assignment, file_name=FILE_NAME,
                                comment=comment)
        db.session.add(class_obj)
        db.session.commit()
