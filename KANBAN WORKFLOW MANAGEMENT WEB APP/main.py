import os
from flask import Flask
from application.config import LocalDevelopmentConfig
from application.database import db
import logging
logging.basicConfig(filename='KanbanAarya.log', level=logging.DEBUG, format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
app = None

def create_app():
  #load the templates
  app = Flask(__name__,template_folder="templates")

  #Deploy your application in any environment without code changes
  if os.getenv('ENV',"development")=='production':
    app.logger.info("Currently no production config is setup.")
    raise Exception("currently there is no production config is setup.")
  else:
    app.logger.info("Staring Local Development.")
    print("Starting the local development")
    app.config.from_object(LocalDevelopmentConfig)

  db.init_app(app)
  app.app_context().push()
  app.logger.info("App setup complete")
  return app

#config the app
app = create_app()

#importing the controllers
from application.controller import *

#run the app
if __name__ == '__main__':
  app.run(host='0.0.0.0',debug=True,port = 8080)



