from datetime import datetime
from config.database import db


class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'))
    content = db.Column(db.String(800), nullable=False)
    plagiarism_percentage = db.Column(db.Integer, nullable=False)
    assignment_type = db.Column(db.Integer, nullable=False)
    start_at = db.Column(db.DateTime, default=datetime.now())
    end_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now(), default=datetime.now())

    def __repr__(self) -> str:
        return 'Assignment>>> {self.content}'
