import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.exceptions import BadRequestKeyError
from config.database import db
from constants.http_status_codes_constant import HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK, \
    HTTP_400_BAD_REQUEST
from routes.auth_routes import auth
from routes.module_routes import module
import services.question_preprocess_service

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

OUTPUTS_GENERATED_DOT_FILES_PATH = os.path.join('outputs', 'generated_dot_files')
OUTPUTS_GENERATED_USE_CASE_DIAGRAMS_PATH = os.path.join('outputs', 'generated_use_case_diagrams')
OUTPUTS_GENERATED_CLASS_DIAGRAMS_PATH = os.path.join('outputs', 'generated_class_diagrams')
OUTPUTS_GENERATED_CLASS_FILES_PATH = os.path.join('outputs', 'generated_class_files')
OUTPUTS_FOLDER = os.path.join(APP_ROOT, 'outputs')
UML_GENERATOR_UPLOAD_FOLDER = os.path.join(APP_ROOT, 'uploads')

app = Flask(__name__)
CORS(app)

app.config.from_mapping(SECRET_KEY=os.environ.get('SECRET_KEY'),
                        SQLALCHEMY_DATABASE_URI=os.environ.get('SQLALCHEMY_DATABASE_URI'),
                        SQLALCHEMY_TRACK_MODIFICATIONS=False, JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY'))
app.config['UML_GENERATOR_UPLOAD_FOLDER'] = UML_GENERATOR_UPLOAD_FOLDER

db.app = app
db.init_app(app)

JWTManager(app)

app.register_blueprint(auth)
app.register_blueprint(module)


@app.before_first_request
def create_tables():
    db.create_all()


@app.get('/api/v1/')
def index():
    return 'UML Diagram Plagiarism Detection Tool API'


@app.route('/api/v1/diagrams/generate', methods=['POST'])
def process_uml_diagrams():
    try:
        if request.method == 'POST':
            data = request.get_json(silent=True)

            if data is None:
                return jsonify('Please attach a scenario file'), HTTP_400_BAD_REQUEST

            generated_class_diagram_path, generated_usecase_diagram_path = services.question_preprocess_service.main(
                data['scenario'])
            return jsonify(generated_class_diagram_path=generated_class_diagram_path,
                           generated_usecase_diagram_path=generated_usecase_diagram_path), HTTP_200_OK

    except Exception or BadRequestKeyError:
        if BadRequestKeyError:
            return jsonify('Please attach a scenario file'), HTTP_400_BAD_REQUEST
        return jsonify('Something went wrong'), HTTP_500_INTERNAL_SERVER_ERROR


@app.route('/api/v1/view-diagram/<path:path>')
def send_js(path):
    return send_from_directory(OUTPUTS_FOLDER, path), HTTP_200_OK


@app.errorhandler(HTTP_404_NOT_FOUND)
def handle_404(error):
    print(error)
    return {'err': 'Not found'}, HTTP_404_NOT_FOUND


@app.errorhandler(HTTP_500_INTERNAL_SERVER_ERROR)
def handle_500(error):
    print(error)
    return {'err': 'Something went wrong'}, HTTP_500_INTERNAL_SERVER_ERROR


if __name__ == '__main__':
    app.run(debug=True)
