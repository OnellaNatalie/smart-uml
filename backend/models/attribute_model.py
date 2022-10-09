from config.database import db


class Attribute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data_type = db.Column(db.String(50))
    name = db.Column(db.String(50), nullable=False)
    access_spec = db.Column(db.String(50))
    class_id = db.Column(db.Integer)

    def __repr__(self) -> str:
        return 'Attribute>>> {self.content}'
