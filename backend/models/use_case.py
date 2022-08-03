from config.database import db
from models.use_case_answer import UseCaseAnswer


class UseCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    use_case_answer = db.Column(UseCaseAnswer, nullable=False)
    text = db.Column(db.String(500), nullable=False)
    x_min = db.Column(db.String(50), nullable=False)
    y_min = db.Column(db.String(50), nullable=False)
    x_max = db.Column(db.String(50), nullable=False)
    y_max = db.Column(db.String(50), nullable=False)
    plagiarism_count = db.Column(db.String(50), nullable=False)
    correctness_count = db.Column(db.String(50), nullable=False)
