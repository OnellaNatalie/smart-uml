from config.database import db


class Method(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    return_type = db.Column(db.String(50))
    name = db.Column(db.String(50), nullable=False)
    access_spec = db.Column(db.String(50))
    class_id = db.Column(db.Integer)

    def __repr__(self) -> str:
        return 'Method>>> {self.content}'
