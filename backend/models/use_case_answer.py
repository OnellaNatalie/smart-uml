from datetime import datetime
from config.database import db
from models.assignment import Assignment
from models.user_model import User


class UseCaseAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(User, nullable=False)
    assignment = db.Column(Assignment, nullable=False)
    comments = db.Column(db.String(800), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.now())
    plagiarism_count = db.Column(db.String(50), nullable=False)
    correctness_count = db.Column(db.String(50), nullable=False)
