import os
from flask import Flask
from application.config import LocalDevelopmentConfig
from application.database import db
from flask import current_app, flash, jsonify, make_response, Response,redirect, request, url_for,render_template
from flask_restful import Api
from flask_cors import CORS
from celery import Celery
from application.cache import cache
import application.workers as workers
from application.models import User,user_prof,blogTable,user_relations
from celery.schedules import crontab
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from io import BytesIO
from reportlab.pdfgen import canvas
from datetime import datetime, date
from celery.task import periodic_task
from weasyprint import HTML
import os
app = None

def create_app():
  #load the templates
  app = Flask(__name__,template_folder="templates")

  #Deploy your application in any environment without code changes
  if os.getenv('ENV',"development")=='production':
    raise Exception("currently there is no production config is setup.")
  else:
    print("Starting the local development")
    app.config.from_object(LocalDevelopmentConfig)
    api = Api(app)
    app.app_context().push()


  CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "OPTIONS","PUT","DELETE"])
  cache.init_app(app)
  db.init_app(app)
  celery = workers.celery
  celery.Task = workers.ContextTask
  
  app.app_context().push()
  celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
  celery.conf.update(app.config)
  return app, api, celery

#config the app
app,api,celery = create_app()



#importing the controllers
from application.operations import *

api.add_resource(LoginRegistration, "/user/logReg")
api.add_resource(UserSearch, "/user/search")
api.add_resource(GetBlog, "/user/blog")
api.add_resource(userFeed, "/user/feed")
api.add_resource(userProfile, "/user/profile")
api.add_resource(userFollower, "/user/follower")
api.add_resource(userFollowing, "/user/following")
api.add_resource(userProfileInfo, "/user/profileInfo")
api.add_resource(deleteProfile, "/user/deleteProfile")
api.add_resource(deletePost, "/user/deletePost")






@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(10.0, test.s('hello'), name='add every 10')

    # Calls test('world') every 30 seconds
    sender.add_periodic_task(30.0, test.s('world'), expires=10)

    
    sender.add_periodic_task(
        crontab(hour=5, minute=47),
        test.s('Happy Day!'),
    )


@periodic_task(
       
    run_every=crontab(day_of_month="04", hour="03", minute="31"),  # Run at midnight on the 1st of every month
    name="send_monthly_reports",
    ignore_result=True
)
def send_monthly_reports():
    with app.app_context():
        
        users = User.query.all()
        for user in users:
            print("hii") 
            # Call the send_monthly_report task for each user
            send_monthly_report.delay(user.user_id, user.user_name, user.email_id)


@celery.task
def send_monthly_report( user_id,username,user_email):
    # Get user information
    user = User.query.get(user_id)
    username = user.user_name
    user_details = user_prof.query.get(user_id)
    num_posts = user_details.total_post
    num_followers = user_details.followers_num
    num_following = user_details.following_count
    last_login=user.prev_login
    first_login=user.first_login_time

    # Generate report using Jinja2
    template = render_template('monthly_report.html', username=username, num_posts=num_posts, num_followers=num_followers,num_following=num_following,first_login=first_login,last_login= last_login)

   
    pdf_bytes = HTML(string=template).write_pdf()

    # Save PDF to file
    pdf_path = os.path.abspath(f"{username}_monthly_report.pdf")
    with open(pdf_path, 'wb') as f:
        f.write(pdf_bytes)

    # Send email with PDF attachment using MailHog
    with smtplib.SMTP('localhost', 1025) as smtp:
        msg = MIMEMultipart()
        msg['To'] = user_email
        msg['From'] = 'yolo@gmail.com'
        msg['Subject'] = 'Monthly Report'
        msg.attach(MIMEText('Please see the attached monthly report.'))

        with open(pdf_path, 'rb') as f:
            attachment = MIMEApplication(f.read(), _subtype='pdf')
            attachment.add_header('Content-Disposition', 'attachment', filename=f'{username}_monthly_report.pdf')
            msg.attach(attachment)

        smtp.sendmail('example@example.com', user_email, msg.as_string())
    
    # Delete PDF file
    os.remove(pdf_path)

    return f"Monthly report sent to {user_email}"

@periodic_task(
    run_every=crontab(hour="03", minute="32"),  # Run every day at 9 AM
    name="dailynotif",
    ignore_result=True
)
def dailynotif():
    # Get all users from the database
    users = User.query.all()

    # Check each user's last login time to see if they have been inactive today
    for user in users:
        last_login_time = datetime.datetime.strptime(user.prev_login, '%Y-%m-%d %H:%M:%S.%f')
        today = date.today()
        date_string = '2023-03-25 14:54:43.874313'

        

        # Check if the user has not logged in today
        if last_login_time.date() < today:
            # Send a notification email to the user
            send_daily_notification.delay(user.user_id, user.user_name, user.email_id)


@celery.task
def send_daily_notification(user_id, user_name, user_email):
    # Send a notification email to the user
    with smtplib.SMTP('localhost', 1025) as smtp:
        msg = MIMEText(f"Hello {user_name}, you have not been active on our website today.")
        msg['To'] = user_email
        msg['From'] = 'yolo@gmail.com'
        msg['Subject'] = 'Daily Notification'

        smtp.sendmail('yolo@gmail.com', user_email, msg.as_string())


@celery.task
def test(arg):
    print(arg)
    return arg





#run the app
if __name__ == '__main__':
  app.run(host='0.0.0.0',debug=True,port = 8080)



