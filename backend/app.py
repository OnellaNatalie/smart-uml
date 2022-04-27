import os
from flask import Flask
from flask_jwt_extended import JWTManager

from config.database import db
from constants.http_status_codes_constant import HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
from routes.auth_routes import auth

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

UPLOADS_FOLDER_PATH = os.path.join(APP_ROOT, 'uploads')
OUTPUTS_GENERATED_DOT_FILES_PATH = os.path.join(UPLOADS_FOLDER_PATH, 'generated_dot_files')
OUTPUTS_GENERATED_USE_CASE_DIAGRAMS_PATH = os.path.join(UPLOADS_FOLDER_PATH, 'generated_use_case_diagrams')
OUTPUTS_GENERATED_CLASS_DIAGRAMS_PATH = os.path.join(UPLOADS_FOLDER_PATH, 'generated_class_diagrams')
OUTPUTS_GENERATED_CLASS_FILES_PATH = os.path.join(UPLOADS_FOLDER_PATH, 'generated_class_files')

app = Flask(__name__)

app.config.from_mapping(SECRET_KEY=os.environ.get('SECRET_KEY'),
                        SQLALCHEMY_DATABASE_URI=os.environ.get('SQLALCHEMY_DATABASE_URI'),
                        SQLALCHEMY_TRACK_MODIFICATIONS=False, JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY'))
db.app = app
db.init_app(app)

JWTManager(app)

app.register_blueprint(auth)


@app.before_first_request
def create_tables():
    db.create_all()


@app.route('/')
def hello_world():
    return 'UML Diagram Plagiarism Detection Tool API'


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
