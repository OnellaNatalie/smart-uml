from config.database import db


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    attributes = db.Column(db.String(50), nullable=False)
    methods = db.Column(db.String(50), nullable=False)