import requests
from flask import Blueprint, jsonify, request
from constants.http_status_codes_constant import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED, \
    HTTP_500_INTERNAL_SERVER_ERROR
from config.database import db
from datetime import datetime
from models.assignment_model import Assignment
from models.module_model import Module

assignment = Blueprint('assignments', __name__, url_prefix='/api/v1/assignments')


@assignment.post('/create')
def create_assignment():
    content = request.json.get('content', '')
    module_id = request.json.get('module_id', '')
    plagiarism_percentage = request.json.get('plagiarism_percentage', '')
    start_at = datetime.strptime(request.json.get('start_at', ''), '%Y-%m-%d %H:%M:%S')
    end_at = datetime.strptime(request.json.get('end_at', ''), '%Y-%m-%d %H:%M:%S')

    if not content or not module_id or not plagiarism_percentage or not start_at or not end_at:
        return jsonify({'err': 'Missing assignment details'}), HTTP_400_BAD_REQUEST

    assignment_obj = Assignment(content=content,
                                module_id=module_id,
                                plagiarism_percentage=plagiarism_percentage,
                                start_at=start_at,
                                end_at=end_at)
    db.session.add(assignment_obj)
    db.session.commit()

    response = requests.post(url="http://127.0.0.1:5000/api/v1/diagrams/generate",
                             json={"scenario": content, "assignment_id": assignment_obj.id})

    if response.ok:
        return jsonify({'msg': 'Assignment created', 'assignment': {
            'id': assignment_obj.id,
            'content': assignment_obj.content,
            'module_id': assignment_obj.module_id,
            'plagiarism_percentage': assignment_obj.plagiarism_percentage,
            'start_at': assignment_obj.start_at,
            'end_at': assignment_obj.end_at,
            'diagrams': response.json()
        }}), HTTP_201_CREATED
    else:
        assignment_obj = Assignment.query.filter_by(id=assignment_obj.id).first()
        db.session.delete(assignment_obj)
        db.commit()
        return jsonify({'err': 'Something went wrong while generating model answers'}), HTTP_500_INTERNAL_SERVER_ERROR


@assignment.get('/')
def get_assignments():
    assignment_obj = db.session.query(Assignment, Module).join(Module).all()
    assignments = []

    for assignment, module in assignment_obj:
        assignments.append(
            {"id": assignment.id, "module_id": assignment.module_id, "code": module.code, "name": module.name, "start_at": assignment.start_at, "end_at": assignment.end_at,
             "created_at": assignment.created_at, "updated_at": assignment.updated_at})

    if assignment_obj is None:
        return jsonify({'err': "Assignments does not exist"}), HTTP_400_BAD_REQUEST

    return jsonify({'msg': 'Assignments found', 'assignments': assignments}), HTTP_200_OK


@assignment.get('/<assignment_id>')
def get_assignment(assignment_id):
    if not assignment_id:
        return jsonify({'err': 'Missing assignment id'}), HTTP_400_BAD_REQUEST

    assignment_obj = Assignment.query.filter_by(id=assignment_id).first()

    if assignment_obj is None:
        return jsonify({'err': "Module does not exist"}), HTTP_400_BAD_REQUEST

    return jsonify({'msg': 'Assignment found', 'assignment': {
        'id': assignment_obj.id,
        'content': assignment_obj.content,
        'module_id': assignment_obj.module_id,
        'plagiarism_percentage': assignment_obj.plagiarism_percentage,
        'start_at': assignment_obj.start_at,
        'end_at': assignment_obj.end_at,
    }}), HTTP_200_OK


@assignment.delete('/<assignment_id>')
def delete_assignment(assignment_id):
    if not assignment_id:
        return jsonify({'err': 'Missing assignment id'}), HTTP_400_BAD_REQUEST

    assignment_obj = Assignment.query.filter_by(id=assignment_id).first()

    if assignment_obj is None:
        return jsonify({'err': "Module does not exist"}), HTTP_400_BAD_REQUEST
    else:
        db.session.delete(assignment_obj)
        db.session.commit()

    return jsonify({'msg': 'Assignment deleted', 'assignment': {
        'id': assignment_obj.id,
        'content': assignment_obj.content,
        'module_id': assignment_obj.module_id,
        'plagiarism_percentage': assignment_obj.plagiarism_percentage,
        'start_at': assignment_obj.start_at,
        'end_at': assignment_obj.end_at,
    }}), HTTP_200_OK


@assignment.patch('/<assignment_id>')
def update_assignment(assignment_id):
    content = request.json.get('content', '')
    module_id = request.json.get('module_id', '')
    plagiarism_percentage = request.json.get('plagiarism_percentage', '')
    start_at = datetime.strptime(request.json.get('start_at', ''), '%Y-%m-%d %H:%M:%S')
    end_at = datetime.strptime(request.json.get('end_at', ''), '%Y-%m-%d %H:%M:%S')

    if not content or not module_id or not plagiarism_percentage or not start_at or not end_at:
        return jsonify({'err': 'Missing assignment details'}), HTTP_400_BAD_REQUEST

    assignment_obj = Assignment.query.filter_by(id=assignment_id).first()
    assignment_obj.content = content
    assignment_obj.module_id = module_id
    assignment_obj.plagiarism_percentage = plagiarism_percentage
    assignment_obj.start_at = start_at
    assignment_obj.end_at = end_at
    db.session.commit()

    return jsonify({'msg': 'Assignment updated', 'assignment': {
        'id': assignment_obj.id,
        'content': assignment_obj.content,
        'module_id': assignment_obj.module_id,
        'plagiarism_percentage': assignment_obj.plagiarism_percentage,
        'start_at': assignment_obj.start_at,
        'end_at': assignment_obj.end_at,
    }}), HTTP_200_OK
