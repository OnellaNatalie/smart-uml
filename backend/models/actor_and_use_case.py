from config.database import db


class ActorANDUseCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    use_case_answer = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    x_min = db.Column(db.String(50), nullable=False)
    y_min = db.Column(db.String(50), nullable=False)
    x_max = db.Column(db.String(50), nullable=False)
    y_max = db.Column(db.String(50), nullable=False)
    plagiarism_count = db.Column(db.String(50))
    correctness_count = db.Column(db.String(50))

    def __repr__(self) -> str:
        return 'ActorANDUseCase>>> {self.content}'
