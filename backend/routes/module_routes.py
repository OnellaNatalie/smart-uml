from flask import Blueprint, jsonify, request
from constants.http_status_codes_constant import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from config.database import db
from models.module_model import Module

module = Blueprint('modules', __name__, url_prefix='/api/v1/modules')


@module.post('/create')
def create_module():
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


@module.get('/')
def get_modules():
    module_obj = Module.query.all()
    modules = []
    print(module_obj)

    for module in module_obj:
        modules.append({"id": module.id, "name": module.name, "code": module.code, "created_at": module.created_at, "updated_at": module.updated_at})

    if module_obj is None:
        return jsonify({'err': "Module does not exist"}), HTTP_400_BAD_REQUEST

    return jsonify({'msg': 'Module found', 'modules': modules}), HTTP_200_OK


@module.get('/<module_id>')
def get_module(module_id):
    if not module_id:
        return jsonify({'err': 'Missing module id'}), HTTP_400_BAD_REQUEST

    module_obj = Module.query.filter_by(id=module_id).first()

    if module_obj is None:
        return jsonify({'err': "Modules does not exist"}), HTTP_400_BAD_REQUEST

    return jsonify({'msg': 'Modules found', 'module': {
        'name': module_obj.name,
        'code': module_obj.code,
        'created_at': module_obj.created_at,
        'updated_at': module_obj.updated_at
    }}), HTTP_200_OK


@module.delete('/<module_id>')
def delete_module(module_id):
    if not module_id:
        return jsonify({'err': 'Missing module id'}), HTTP_400_BAD_REQUEST

    module_obj = Module.query.filter_by(id=module_id).first()

    if module_obj is None:
        return jsonify({'err': "Module does not exist"}), HTTP_400_BAD_REQUEST
    else:
        db.session.delete(module_obj)
        db.session.commit()

    return jsonify({'msg': 'Module deleted', 'module': {
        'name': module_obj.name,
        'code': module_obj.code,
        'created_at': module_obj.created_at,
        'updated_at': module_obj.updated_at
    }}), HTTP_200_OK


@module.patch('/<module_id>')
def update_module(module_id):
    name = request.json.get('name', '')
    code = request.json.get('code', '')

    if not name or not code:
        return jsonify({'err': 'Missing module name or code'}), HTTP_400_BAD_REQUEST

    module_obj = Module.query.filter_by(id=module_id).first()
    module_obj.code = code
    module_obj.name = name
    db.session.commit()

    return jsonify({'msg': 'Module updated', 'module': {
        'id': module_obj.id,
        'name': module_obj.name,
        'code': module_obj.code,
    }}), HTTP_200_OK
