from .database import db
from flask_login import UserMixin
class Admin(db.Model,UserMixin):
  _tablename_ = 'admin'
  admin_id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  name = db.Column(db.String, nullable=False)
  email_id = db.Column(db.String,nullable=False,unique=True)
  adminname = db.Column(db.String,nullable=False,unique=True)
  password = db.Column(db.String, nullable=False)
  profile_img_url = db.Column(db.String)

class User(db.Model,UserMixin):
  _tablename_ = 'user'
  user_id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  name = db.Column(db.String, nullable=False)
  email_id = db.Column(db.String,nullable=False,unique=True)
  mobile_no = db.Column(db.String,nullable=False,unique=True)
  username = db.Column(db.String,nullable=False,unique=True)
  password = db.Column(db.String, nullable=False)
  profile_img_url = db.Column(db.String)
  prev_login=db.Column(db.String)

class Venue(db.Model):
  _tablename_ = 'venue'
  venue_id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  admin_id = db.Column(db.Integer,db.ForeignKey(Admin.admin_id),nullable=False)
  venue_name = db.Column(db.String,nullable=False)
  place = db.Column(db.String,nullable=False)
  location = db.Column(db.String,nullable=False)

class Hall(db.Model):
  _tablename_ = 'hall'
  hall_id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  admin_id = db.Column(db.Integer,db.ForeignKey(Admin.admin_id),nullable=False)
  venue_id = db.Column(db.Integer,db.ForeignKey(Venue.venue_id),nullable=False)
  hall_capacity = db.Column(db.Integer,nullable=False)
  status = db.Column(db.String)

class Show(db.Model):
  _tablename_ = 'show'
  show_id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  admin_id = db.Column(db.Integer,db.ForeignKey(Admin.admin_id),nullable=False)
  venue_id = db.Column(db.Integer,db.ForeignKey(Venue.venue_id),nullable=False)
  hall_id = db.Column(db.Integer,db.ForeignKey(Hall.hall_id),nullable=False)
  show_name = db.Column(db.String,nullable=False)
  rating = db.Column(db.Integer)
  timing = db.Column(db.String,nullable=False)
  tag = db.Column(db.String,nullable=False)
  price = db.Column(db.Integer,nullable=False)
  total_rating = db.Column(db.Integer)
  capacity = db.Column(db.Integer)
  poster_url = db.Column(db.String)

class Booking(db.Model):
  _tablename_ = 'booking'
  booking_id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  user_id = db.Column(db.Integer,db.ForeignKey(User.user_id),nullable=False)
  venue_id = db.Column(db.Integer,db.ForeignKey(Venue.venue_id),nullable=False)
  show_id = db.Column(db.Integer,db.ForeignKey(Show.show_id),nullable=False)
  total_seat = db.Column(db.Integer,nullable=False)
  booked_on = db.Column(db.String,nullable=False)
  booked_for = db.Column(db.String,nullable=False)