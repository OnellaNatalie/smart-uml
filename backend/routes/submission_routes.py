import json

from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from constants.http_status_codes_constant import HTTP_400_BAD_REQUEST, HTTP_200_OK
from services.submission_service import save_submission
submission = Blueprint('submissions', __name__, url_prefix='/api/v1/submissions')


@submission.post('/upload')
@jwt_required()
def upload_submission():
    user_id = get_jwt_identity()

    image = request.files['file']
    json_data = json.loads(request.form['data'])
    submission_type = json_data['type']
    assignment_id = json_data['id']
    comment = json_data['comment']

    if submission_type is None or image is None or assignment_id is None:
        return jsonify({'err': 'invalid request '}), HTTP_400_BAD_REQUEST
    elif submission_type == 'use case':
        save_submission(assignment_id, image, submission_type, comment, user_id)
        return HTTP_200_OK
    elif submission_type == 'class':
        save_submission(assignment_id, image, submission_type, comment, user_id)
        return HTTP_200_OK
    else:
        return jsonify({'err': 'invalid request '}), HTTP_400_BAD_REQUEST
