from config.database import db


class Multiplicity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(50))
    relationship_id = db.Column(db.String(50))
    x_min = db.Column(db.String(50), nullable=False)
    y_min = db.Column(db.String(50), nullable=False)
    x_max = db.Column(db.String(50), nullable=False)
    y_max = db.Column(db.String(50), nullable=False)

    def __repr__(self) -> str:
        return 'Class_Multiplicity>>> {self.content}'
