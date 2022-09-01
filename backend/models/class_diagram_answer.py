from datetime import datetime
from config.database import db


class ClassAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, nullable=False)
    assignment = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.String(800), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.now())
    plagiarism_count = db.Column(db.String(50))
    correctness_count = db.Column(db.String(50))
    file_name = db.Column(db.String(50), nullable=False)

    def __repr__(self) -> str:
        return 'ClassAnswer>>> {self.content}'
