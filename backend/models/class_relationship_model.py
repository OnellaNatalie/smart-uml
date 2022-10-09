from config.database import db


class Relationship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    class_answer = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50))
    type = db.Column(db.String(50), nullable=False)
    x_min = db.Column(db.String(50), nullable=False)
    y_min = db.Column(db.String(50), nullable=False)
    x_max = db.Column(db.String(50), nullable=False)
    y_max = db.Column(db.String(50), nullable=False)
    comp_1 = db.Column(db.Integer, nullable=False)
    comp_2 = db.Column(db.Integer, nullable=False)

    def __repr__(self) -> str:
        return 'class_relationship>>> {self.content}'
