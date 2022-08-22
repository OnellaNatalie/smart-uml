import validators
from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, decode_token
from constants.http_status_codes_constant import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, \
    HTTP_409_CONFLICT, HTTP_201_CREATED
from config.database import db
from models.module_model import Module

module = Blueprint('modules', __name__, url_prefix='/api/v1/modules')


@module.post('/create')
def create():
    name = request.json.get('name', '')
    code = request.json.get('code', '')

    if not name or not code:
        return jsonify({'err': 'Missing module name or code'}), HTTP_400_BAD_REQUEST

    module_obj = Module(name=name, code=code)
    db.session.add(module_obj)
    db.session.commit()

    return jsonify({'msg': 'Module created', 'module': {
        'id': module_obj.id,
        'name': module_obj.name,
        'code': module_obj.code,
    }}), HTTP_201_CREATED


@module.get('/<module_id>')
def get_post(module_id):
    if not id:
        return jsonify({'err': 'Missing module id'}), HTTP_400_BAD_REQUEST

    print(module_id)

    module_obj = Module.query.filter_by(id=module_id).first()

    if module_obj is None:
        return jsonify({'err': "Module does not exist"}), HTTP_400_BAD_REQUEST

    return jsonify({'msg': 'Module found', 'module': {
        'name': module_obj.name,
        'email': module_obj.code,
        'created_at': module_obj.created_at,
        'updated_at': module_obj.updated_at
    }}), HTTP_200_OK
