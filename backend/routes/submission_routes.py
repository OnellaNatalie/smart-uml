import json

from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from constants.http_status_codes_constant import HTTP_400_BAD_REQUEST, HTTP_200_OK
from models.actor_and_use_case import ActorANDUseCase
from services.submission_service import save_submission
from services.use_case_model_detection_service import model_object_detection

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
        use_case_obj = save_submission(assignment_id, image, submission_type, comment, user_id)
        model_object_detection(image.filename, use_case_obj.id)
        return jsonify({'filename': image.filename}), HTTP_200_OK
    elif submission_type == 'class':
        class_obj = save_submission(assignment_id, image, submission_type, comment, user_id)
        return jsonify({'id': str(class_obj.id)}), HTTP_200_OK
    else:
        return jsonify({'err': 'invalid request '}), HTTP_400_BAD_REQUEST
