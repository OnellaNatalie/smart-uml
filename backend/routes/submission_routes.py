from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from constants.http_status_codes_constant import HTTP_400_BAD_REQUEST
from models.user_model import User
from services.submission_service import save_submission

submissions = Blueprint('diagrams', __name__, url_prefix='/api/v1/submission')


@submissions.post('/submission')
@jwt_required()
def submission():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    submission_type = request.json.get('type', '')
    assignment_id = request.json.get('id', '')
    comment = request.json.get('comment', '')
    image = request.files['file']

    if submission_type is None or image is None or assignment_id is None:
        return jsonify({'err': 'invalid request '}), HTTP_400_BAD_REQUEST
    elif submission_type == 'use case':
        save_submission(assignment_id, image, submission_type, comment, user)
    elif submission_type == 'class':
        save_submission(assignment_id, image, submission_type, comment, user)
    else:
        return jsonify({'err': 'invalid request '}), HTTP_400_BAD_REQUEST
