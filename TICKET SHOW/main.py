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
from application.models import Admin, User, Venue, Show, Booking, Hall
from celery.schedules import crontab
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from io import BytesIO
# from reportlab.pdfgen import canvas
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

api.add_resource(AdminLogin, "/admin/login")
api.add_resource(UserLogin, "/user/login")
api.add_resource(AdminRegistration, "/admin/registration")
api.add_resource(UserRegistration, "/user/registration")
api.add_resource(ShowSearch, "/user/show_search")
api.add_resource(VenueSearch, "/user/venue_search")
api.add_resource(UserProfile, "/user/user_profile")
api.add_resource(AdminProfile, "/admin/admin_profile")
api.add_resource(AddVenue, "/admin/addVenue")
api.add_resource(AddHall, "/admin/addHall/<venue_id>")
api.add_resource(AddShow, "/admin/addShow/<venue_id>/<hall_id>")
api.add_resource(BookShow, "/user/bookShow/<venue_id>/<show_id>")
api.add_resource(DeleteBooking, "/user/deleteBooking/<booking_id>")
api.add_resource(DeleteUser, "/user/deleteUser")
api.add_resource(DeleteAdmin, "/admin/deleteAdmin")
api.add_resource(DeleteVenue, "/admin/deleteVenue/<venue_id>")
api.add_resource(DeleteHall, "/admin/deleteHall/<hall_id>")
api.add_resource(DeleteShow, "/admin/deleteShow/<show_id>")
api.add_resource(AdminEditProfile, "/admin/admin_editProfile")
api.add_resource(EditVenue, "/admin/editVenue/<venue_id>")
api.add_resource(EditHall, "/admin/editHall/<hall_id>")
api.add_resource(EditShow, "/admin/editShow/<show_id>")
api.add_resource(ShowDetails, "/user/showDetails/<show_id>")
api.add_resource(GetDetails, "/user/getDetails")
api.add_resource(VenueShow, "/user/venueShow/<venue_id>")
api.add_resource(UserEditProfile, "/user/user_editProfile")





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
       
    run_every=crontab(day_of_month="12", hour="7", minute="3"),  # Run at midnight on the 1st of every month
    name="send_monthly_reports",
    ignore_result=True
)
def send_monthly_reports():
    with app.app_context():
        
        users = User.query.all()
        for user in users:
            # Call the send_monthly_report task for each user
            print("----------------")
            print(user.user_id, user.username, user.email_id)
            print("----------------")
            send_monthly_report(user.user_id, user.username, user.email_id)


# @celery.task
def send_monthly_report( user_id,username,email_id):
    # Get user information
    
    user = User.query.get(user_id)
    username = user.username
    booking_details = Booking.query.filter_by(user_id=user.user_id).all()
    show_name = []
    venue_name = []
    for booking in booking_details:
        show_name.append(Show.query.filter_by(show_id=booking.show_id).first().show_name)
        venue_name.append(Venue.query.filter_by(venue_id=booking.venue_id).first().venue_name)
    last_login = user.prev_login

    # Generate report using Jinja2
    
    template = render_template('monthly_report.html', username=username, booking_details=booking_details, show_name=show_name,venue_name=venue_name, last_login= last_login)

   
    pdf_bytes = HTML(string=template).write_pdf()

    # Save PDF to file
    pdf_path = os.path.abspath(f"{username}_monthly_report.pdf")
    with open(pdf_path, 'wb') as f:
        f.write(pdf_bytes)

    # Send email with PDF attachment using MailHog
    with smtplib.SMTP('localhost', 1025) as smtp:
        msg = MIMEMultipart()
        msg['To'] = email_id
        msg['From'] = 'mdfarhanreza16@gmail.com'
        msg['Subject'] = 'Monthly Report'
        msg.attach(MIMEText('Please see the attached monthly report.'))

        with open(pdf_path, 'rb') as f:
            attachment = MIMEApplication(f.read(), _subtype='pdf')
            attachment.add_header('Content-Disposition', 'attachment', filename=f'{username}_monthly_report.pdf')
            msg.attach(attachment)

        smtp.sendmail('example@example.com', email_id, msg.as_string())
    
    # Delete PDF file
    os.remove(pdf_path)
    print("----------",last_login,"--------------",type(last_login),"------------")
    return f"Monthly report sent to {email_id}"

@periodic_task(
    run_every=crontab(hour="5", minute="35"),  # Run every day at 9 AM
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
        date_string = '2023-08-07 08:47:43.874313'

        

        # Check if the user has not logged in today
        if last_login_time.date() < today:
            # Send a notification email to the user
            send_daily_notification.delay(user.user_id, user.username, user.email_id)


@celery.task
def send_daily_notification(user_id, username, email_id):
    # Send a notification email to the user
    with smtplib.SMTP('localhost', 1025) as smtp:
        msg = MIMEText(f"Hello {username}, you have not been active on our website today.")
        msg['To'] = email_id
        msg['From'] = 'mdfarhanreza16@gmail.com'
        msg['Subject'] = 'Daily Notification'

        smtp.sendmail('mdfarhanreza16@gmail.com', email_id, msg.as_string())


@celery.task
def test(arg):
    print(arg)
    return arg





#run the app
if __name__ == '__main__':
  app.run(host='0.0.0.0',debug=True,port = 8080)



