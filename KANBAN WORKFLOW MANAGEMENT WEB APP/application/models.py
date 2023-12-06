from .database import db
from flask_login import UserMixin
class User(db.Model, UserMixin):
  __tablename__ = 'user'
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(20), nullable=False, unique=True)
  password = db.Column(db.String(80), nullable=False)
class List(db.Model):
  __tablename__ = 'list'
  id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  user_id = db.Column(db.Integer,db.ForeignKey('user.id'), nullable=False)
  list_name = db.Column(db.String, nullable=False)
  list_description = db.Column(db.String)

class Card(db.Model):
  __tablename__ = 'card'
  id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  list_id = db.Column(db.Integer,db.ForeignKey('list.id'), nullable=False)
  title = db.Column(db.String, nullable=False)
  content = db.Column(db.String)
  deadline = db.Column(db.String)
  status = db.Column(db.String)
  start_date = db.Column(db.String, nullable=False)
  complete_date = db.Column(db.String)