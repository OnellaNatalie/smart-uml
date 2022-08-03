from datetime import datetime
from config.database import db
from models.user_model import User


class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(User, nullable=False)
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.String(800), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    start_at = db.Column(db.DateTime)
    end_at = db.Column(db.DateTime)
    type = db.Column(db.String(50), nullable=False)
