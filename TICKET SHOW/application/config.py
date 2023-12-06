import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
  DEBUG = True
  SQLITE_DB_DIR = None
  SQLALCHEMY_DATABASE_URI = None
  SQLALCHEMY_TRACK_MODIFICATIONS = False

class LocalDevelopmentConfig(Config):
  SQLITE_DB_DIR = os.path.join(basedir,"../db_directory")
  SQLALCHEMY_DATABASE_URI = "sqlite:///"+os.path.join(SQLITE_DB_DIR,"ticket_show.sqlite3")
  DEBUG = True
  SECRET_KEY = 'itsasecret'
  CELERY_BROKER_URL='redis://localhost:6379/0'
  CELERY_RESULT_BACKEND='redis://localhost:6379/0'
  CACHE_REDIS_URL= 'redis://localhost:6379/3'
  CACHE_TYPE = 'RedisCache'
  CACHE_DEFAULT_TIMEOUT = 100