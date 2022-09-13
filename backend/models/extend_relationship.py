from config.database import db


class ExtendRelationship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    use_case_answer = db.Column(db.Integer, nullable=False)
    connected_component_01 = db.Column(db.Integer, nullable=False)
    connected_component_02 = db.Column(db.Integer, nullable=False)
    plagiarism_count = db.Column(db.String(50))
    correctness_count = db.Column(db.String(50))

    def __repr__(self) -> str:
        return 'ExtendRelationship>>> {self.content}'
