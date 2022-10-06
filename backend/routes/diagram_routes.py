from flask import request, jsonify, send_from_directory, Blueprint
from werkzeug.exceptions import BadRequestKeyError
from app import *
from config.database import db
from constants.http_status_codes_constant import HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK, \
    HTTP_400_BAD_REQUEST
import services.question_preprocess_service
from models.diagram_model import Diagram

diagram = Blueprint('diagrams', __name__, url_prefix='/api/v1/diagrams')


@diagram.post('/generate')
def generate_diagrams():
    try:
        data = request.get_json(silent=True)

        if data is None:
            return jsonify('Please attach assignment details'), HTTP_400_BAD_REQUEST

        generated_class_diagram_path, generated_usecase_diagram_path = services.question_preprocess_service.main(
            data['scenario'])

        if generated_usecase_diagram_path or generated_usecase_diagram_path:
            diagram_obj = Diagram(assignment_id=data['assignment_id'],
                                  usecase_diagram_path=generated_usecase_diagram_path,
                                  class_diagram_path=generated_class_diagram_path)
            db.session.add(diagram_obj)
            db.session.commit()
        else:
            return jsonify('Something went wrong'), HTTP_500_INTERNAL_SERVER_ERROR

        return jsonify(generated_class_diagram_path=generated_class_diagram_path,
                       generated_usecase_diagram_path=generated_usecase_diagram_path), HTTP_200_OK

    except Exception or BadRequestKeyError:
        if BadRequestKeyError:
            return jsonify('Please attach assignment details'), HTTP_400_BAD_REQUEST
        return jsonify('Something went wrong'), HTTP_500_INTERNAL_SERVER_ERROR


@diagram.get('/<assignment_id>')
def get_diagrams(assignment_id):
    diagram_obj = Diagram.query.filter_by(assignment_id=assignment_id).first()

    if diagram_obj is None:
        return jsonify({"err": "No diagram found"}, HTTP_404_NOT_FOUND)

    return jsonify({'msg': 'Diagrams found', 'diagrams': {'class_diagram': diagram_obj.class_diagram_path, 'usecase_diagram': diagram_obj.usecase_diagram_path}}), HTTP_200_OK
