import os
import app
from datetime import datetime

from config.database import db
from models.class_diagram_answer import ClassAnswer
from models.use_case_answer import UseCaseAnswer


def save_submission(assignment_id, image, submission_type, comment, user_id):
    # date_now = str(datetime.now())
    # file_name = image.filename + '-' + date_now+'.jpg'

    if submission_type == 'use case':
        image.save(os.path.join(app.SUBMISSION_PATH, image.filename))
        use_case_obj = UseCaseAnswer(user=user_id, assignment=assignment_id, file_name=image.filename,
                                     comments=comment)
        db.session.add(use_case_obj)
        db.session.commit()
    else:
        image.save(os.path.join(app.SUBMISSION_PATH, image.filename))
        class_obj = ClassAnswer(user=user_id, assignment=assignment_id, file_name=image.filename,
                                comments=comment)
        db.session.add(class_obj)
        db.session.commit()
