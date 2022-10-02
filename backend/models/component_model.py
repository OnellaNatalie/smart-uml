from sqlalchemy.orm import relationship

from config.database import db


class Component(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    class_answer = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), nullable=False)

    def __repr__(self) -> str:
        return 'Class>>> {self.content}'
