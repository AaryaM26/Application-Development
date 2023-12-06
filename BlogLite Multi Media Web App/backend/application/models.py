#!/usr/bin/env python
# coding: utf-8

# In[ ]:


from .database import db
from flask_login import UserMixin
class User(db.Model,UserMixin):
  __tablename__ = 'user'
  user_id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  user_name = db.Column(db.String, nullable=False, unique=True)
  password = db.Column(db.String, nullable=False)
  email_id=db.Column(db.String,nullable=False,unique=True)
  mobile_num=db.Column(db.String,nullable=False,unique=True)
  first_login_time=db.Column(db.String,nullable=False)
  Name=db.Column(db.String,nullable=False)
  prev_login=db.Column(db.String)

class user_prof(db.Model):
  __tablename__ = 'user_profile'
  user_id = db.Column(db.Integer,db.ForeignKey(User.user_id),primary_key = True)
  total_post = db.Column(db.Integer)
  followers_num=db.Column(db.Integer)
  following_count=db.Column(db.Integer)
  profile_img_URL=db.Column(db.String)

class blogTable(db.Model):
  __tablename__ = 'blog'
  blog_id = db.Column(db.Integer,autoincrement = True, primary_key = True)
  user_id = db.Column(db.Integer,db.ForeignKey(User.user_id),nullable=False)
  title = db.Column(db.String,nullable=False)
  content = db.Column(db.String,nullable=False)
  blog_image_url = db.Column(db.String)
  blog_timestamp = db.Column(db.String,nullable=False)
  blog_status = db.Column(db.String,nullable=False)
  user_name = db.Column(db.String,db.ForeignKey(User.user_name),nullable=False)

class user_relations(db.Model):
  __tablename__ = 'user_relations'
  user_id = db.Column(db.Integer,db.ForeignKey(User.user_id),nullable=False,primary_key = True)
  follower_id = db.Column(db.Integer,db.ForeignKey(User.user_id),nullable=False,primary_key = True)
  user_name = db.Column(db.String,db.ForeignKey(User.user_name),nullable=False)
  follower_username = db.Column(db.String,db.ForeignKey(User.user_name),nullable=False)

