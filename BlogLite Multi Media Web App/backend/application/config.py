import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
  DEBUG = True
  SQLITE_DB_DIR = None
  SQLALCHEMY_DATABASE_URI = None
  SQLALCHEMY_TRACK_MODIFICATIONS = False

class LocalDevelopmentConfig(Config):
  SQLITE_DB_DIR = os.path.join(basedir,"../db_directory")
  SQLALCHEMY_DATABASE_URI = "sqlite:///"+os.path.join(SQLITE_DB_DIR,"bloglitenew.sqlite3")
  DEBUG = True
  SECRET_KEY = 'itsasecret'
  CELERY_BROKER_URL='redis://localhost:6379/0'
  CELERY_RESULT_BACKEND='redis://localhost:6379/0'
  CACHE_REDIS_URL= 'redis://localhost:6379/3'
  CACHE_TYPE = 'RedisCache'
  CACHE_DEFAULT_TIMEOUT = 100
  # MAIL_SERVER= 'smtp.gmail.com'
  # MAIL_PORT= 587
  # MAIL_USE_TLS = True
  # MAIL_USERNAME= 'archary2026@gmail.com'  
  # MAIL_PASSWORD= 'dailyoga!'   
  # MAIL_DEFAULT_SENDER= 'archary2026@gmail.com' 
  #app.config['MAIL_USE_TLS'] = False
  #app.config['MAIL_USE_SSL'] = True 