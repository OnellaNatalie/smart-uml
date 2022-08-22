from datetime import datetime
from config.database import db


class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.String(80), unique=True, nullable=False)
    content = db.Column(db.String(), unique=True, nullable=False)
    plagiarism_percentage = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now(), default=datetime.now())

    def __repr__(self) -> str:
        return 'Assignment>>> {self.content}'
