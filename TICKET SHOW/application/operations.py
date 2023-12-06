from flask import Flask, request,jsonify,make_response
import jwt
import datetime
from flask_sqlalchemy import SQLAlchemy
from  sqlalchemy.sql.expression import func, select
from application.token_validation import *
from flask import current_app as app
from .database import db
from application.models import Admin, User, Venue, Show, Booking, Hall
from flask_bcrypt import Bcrypt
from functools import wraps
from flask_restful import Resource
# from application.cache import cache

bcrypt = Bcrypt(app)
class AdminLogin(Resource):
    def get(self):
        auth=request.authorization
        if not auth or not auth.username or not auth.password:
            return make_response('Could not verify',401,{'WWW-Authentikate': 'Basic realm = "Login Reqired!"'} )

        admin = Admin.query.filter_by(adminname=auth.username).first()
        
        if not admin:
            return make_response(jsonify({'error': 'no user found','code': 404}), 404)
        if bcrypt.check_password_hash(admin.password, auth.password):

            token=Validate_and_generate_token.generate2(admin_id=admin.admin_id)
            db.session.commit()
            return make_response(jsonify({'admin_id':admin.admin_id,'token':token,'code': 200}),200)

        return make_response(jsonify({'error': 'INCORRECT PASSWORD','code': 401}), 401)
class UserLogin(Resource):
    def get(self):
        auth=request.authorization
        
        if not auth or not auth.username or not auth.password:
            return make_response('Could not verify',401,{'WWW-Authentikate': 'Basic realm = "Login Reqired!"'} )

        user = User.query.filter_by(username=auth.username).first()
        print(user)
        if not user:
            return make_response(jsonify({'error': 'no user found','code': 404}), 404)
        if bcrypt.check_password_hash(user.password, auth.password):
            print("Hi")
            token=Validate_and_generate_token.generate(user_id=user.user_id)
            user.prev_login=datetime.datetime.now()
            db.session.commit()
            print("hello")
            return make_response(jsonify({'user_id':user.user_id,'token':token,'code': 200}),200)

        return make_response(jsonify({'error': 'INCORRECT PASSWORD','code': 401}), 401)
class AdminRegistration(Resource):
    def post(self):
        try:
            data=request.get_json()
            hashed_password=bcrypt.generate_password_hash(data['password'])
            adminname=data['adminname']
            admin = Admin.query.filter_by(adminname=adminname).first()
            if admin:
                print("entered if")
                response = {'error': 'This user already exists'}
                return make_response(jsonify(response), 400)
            else:
                new_admin = Admin(name=data['name'], email_id=data['email_id'], adminname=data['adminname'], password=hashed_password,profile_img_url=data["profile_img_url"])
                db.session.add(new_admin)
                db.session.commit()
                response = {'message': 'New admin created'}
                return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class UserRegistration(Resource):
    def post(self):
        try:
            data=request.get_json()
            hashed_password=bcrypt.generate_password_hash(data['password'])
            print(data['password'])
            username=data['username']
            print(username)
            user = User.query.filter_by(username=username).first()
            if user:
                response = {'error': 'This user already exists'}
                return make_response(jsonify(response), 400)
            else:
                new_user = User(name=data['name'], email_id=data['email_id'],mobile_no=data['mobile_no'], username=data['username'], password=hashed_password,profile_img_url=data['profile_img_url'])
                print(new_user)
                db.session.add(new_user)
                db.session.commit()
                response = {'message': 'New user created'}
                return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': "oops something went wrong","code":500})
class ShowSearch(Resource):
    def get(self):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            # Step 1: Fetch the userID and search_string from the query string
            user_id = payload["user_id"]
            
            search_string = request.args.get("search_string")
            
            if not search_string:
                return jsonify({"error": "Search string is missing"})

           
            shows_details = Show.query.filter(Show.show_name.like("%" + search_string + "%")).all()

            
            shows = []

            for show in shows_details:
                shows.append({"show_id":show.show_id,"show_name":show.show_name,"poster_url":show.poster_url,"tag":show.tag,"rating":show.rating,"total_rating":show.total_rating,"price":show.price})
            return jsonify({"user_id":user_id, "shows":shows})

            
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class VenueSearch(Resource):
    def get(self):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            # Step 1: Fetch the userID and search_string from the query string
            user_id = payload["user_id"]
            
            search_string = request.args.get("search_string")
            
            if not search_string:
                return jsonify({"error": "Search string is missing"})

           
            venues = Venue.query.filter(Venue.location.like("%" + search_string + "%")).all()
            

            
            result = []
            for venue in venues:
                # show_detail = Show.query.filter_by(venue_id = venue.venue_id).all()
                # show_names = []
                # for shows in show_detail:
                #     show_names.append(shows.show_name)
                
                result.append({"venue_id":venue.venue_id, "venue_name": venue.venue_name, "place": venue.place, "location": venue.location})

            
            return jsonify({"result": result,"code":200})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class UserProfile(Resource):
    def get(self):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            user_id = payload["user_id"]
            if not user_id:
                return jsonify({"error": "userID are required"})
            profile = User.query.get(user_id)
            result = []
            shows = []
            venues = []
            latest = []
            poster = []
            rated = []
            rated_details = Show.query.order_by((Show.rating/Show.total_rating).desc()).limit(3)
            for show in rated_details:
                if len(show.poster_url)>0:
                    rating = 0
                if len(show.poster_url)>0:
                    if show.total_rating>0:
                        rating = show.rating/show.total_rating
                    rated.append({"show_id":show.show_id,"show_name":show.show_name,"poster_url":show.poster_url,"tag":show.tag,"rating":rating,"total_rating":show.total_rating})
            poster_details = Show.query.order_by(func.random()).limit(3)
            for show in poster_details:
                rating = 0
                if len(show.poster_url)>0:
                    if show.total_rating>0:
                        rating = show.rating/show.total_rating
                    poster.append({"show_id":show.show_id,"show_name":show.show_name,"poster_url":show.poster_url,"tag":show.tag,"rating":rating,"total_rating":show.total_rating})
            latest_shows = Show.query.order_by(Show.show_id.desc()).limit(3)
            for show in latest_shows:
                rating = 0
                if len(show.poster_url)>0:
                    if show.total_rating>0:
                        rating = show.rating/show.total_rating
                latest.append({"show_id":show.show_id,"show_name":show.show_name,"poster_url":show.poster_url,"tag":show.tag,"rating":rating,"total_rating":show.total_rating})
            shows_details = Show.query.order_by(func.random()).limit(3)
            for show in shows_details:
                rating = 0
                if len(show.poster_url)>0:
                    if show.total_rating>0:
                        rating = show.rating/show.total_rating
                shows.append({"show_id":show.show_id,"show_name":show.show_name,"poster_url":show.poster_url,"tag":show.tag,"rating":rating,"total_rating":show.total_rating})
            venues_details = Venue.query.order_by(func.random()).limit(3)
            for venue in venues_details:
                venues.append({"venue_id":venue.venue_id,"venue_name":venue.venue_name,"place":venue.place,"location":venue.location})
            booking_details = Booking.query.filter_by(user_id=user_id).all()
            for booking in booking_details:
                show = Show.query.filter_by(show_id=booking.show_id).first()
                venue = Venue.query.filter_by(venue_id=booking.venue_id).first()
                result.append({"booking_id":booking.booking_id,"venue_name":venue.venue_name, "show_name":show.show_name, "timing":show.timing, "total_seat":booking.total_seat,"poster_url":show.poster_url,"booked_for":booking.booked_for})
            return jsonify({"user_id":user_id, "name":profile.name, "email_id":profile.email_id, "mobile_no": profile.mobile_no, "username": profile.username, "profile_img_url": profile.profile_img_url, "result":result,"shows":shows,"venues":venues,"latest":latest,"poster":poster,"rated":rated})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            print(e)
            return jsonify({'error': 'opps something went wrong',"code":500})
class AdminProfile(Resource):
    def get(self):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            admin_id = payload["admin_id"]
            if not admin_id:
                return jsonify({"error": "adminID are required"})
            profile = Admin.query.get(admin_id)
            result = []
            result1 = []
            result2 = []
            venue_details = Venue.query.filter_by(admin_id=admin_id).all()
            for venue in venue_details:
                show_details = Show.query.filter_by(venue_id=venue.venue_id).all()
                for show in show_details:
                    rating = 0
                    if show.total_rating>0:
                        rating = show.rating/show.total_rating
                    result1.append({"show_id":show.show_id,"show_name":show.show_name,"venue_name":venue.venue_name,"rating":rating,"total_rating":show.total_rating,"timing":show.timing,"tag":show.tag,"poster_url":show.poster_url})
                
                hall_details = Hall.query.filter_by(venue_id=venue.venue_id).all()
                for hall in hall_details:
                    result2.append({"hall_id":hall.hall_id,"venue_name":venue.venue_name,"hall_capacity":hall.hall_capacity,"status":hall.status})

                result.append({"venue_id":venue.venue_id,"venue_name":venue.venue_name, "place":venue.place, "location": venue.location})
            return jsonify({"admin_id":admin_id, "name":profile.name, "email_id":profile.email_id,"adminname": profile.adminname, "profile_img_url": profile.profile_img_url,"result":result,"result1":result1,"result2":result2})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class AddVenue(Resource):
    def post(self):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            admin_id = payload["admin_id"]
            admin = Admin.query.get(admin_id)
            #fetch post data from request.payload
            data=request.get_json()

            venue = Venue(admin_id=admin_id,venue_name=data["venue_name"],place=data["place"],location=data["location"])
            
            db.session.add(venue)
            db.session.commit()
            
            return jsonify({"created": "true","errorMessage": "null"})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500}) 
   
    def get(self):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            admin_id = payload["admin_id"]
            admin = Admin.query.get(admin_id)
            result = []
            venues = Venue.query.filter_by(admin_id=admin_id).all()
            print(venues)
            for venue in venues:
                result.append({"venue_id":venue.venue_id,"venue_name":venue.venue_name, "place":venue.place, "location": venue.location})
            return jsonify({"result": result})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500}) 
class AddHall(Resource):
    def post(self,venue_id):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})
            #fetch post data from request.payload
            admin_id = payload["admin_id"]
            print("venue_id",venue_id)
            data=request.get_json()

            hall = Hall(admin_id=admin_id,venue_id=venue_id,hall_capacity=data["hall_capacity"],status="NOT OCCUPIED")
            
            db.session.add(hall)
            db.session.commit()
            
            return jsonify({"created": "true","errorMessage": "null"})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})

    def get(self,venue_id): 
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            admin_id = payload["admin_id"]
            admin = Admin.query.get(admin_id)
            result = []
            halls = Hall.query.filter_by(venue_id=venue_id).all()
            print(halls)
            for hall in halls:
                result.append({"hall_id":hall.hall_id,"hall_capacity":hall.hall_capacity})
            return jsonify({"result": result})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500}) 
class AddShow(Resource):
    def post(self,venue_id,hall_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})
            hall = Hall.query.filter_by(hall_id=hall_id).first()
            status = hall.status
            if status == "OCCUPIED":
                return jsonify({"error": "Already occupied","code":498})
            admin_id = payload["admin_id"]
            admin = Admin.query.get(admin_id)
            #fetch post data from request.payload
            data=request.get_json()
            show = Show(admin_id=admin_id,venue_id=venue_id,hall_id=hall_id,show_name=data["show_name"],timing=data["timing"],tag=data["tag"].lower(),price=data["price"],rating=0,total_rating=0,poster_url=data["poster_url"],capacity=0)
            hall.status = "OCCUPIED"
            db.session.add(show)
            db.session.commit()
            return jsonify({"created": "true","errorMessage": "null"})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            return jsonify({'error': 'opps something went wrong',"code":500}) 
class BookShow(Resource):
    def post(self,venue_id,show_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            user_id = payload["user_id"]
            user = User.query.get(user_id)
            #fetch post data from request.payload
            data=request.get_json()
            print(data)
            show = Show.query.filter_by(show_id=show_id).first()

            hall_capacity = Hall.query.filter_by(hall_id=show.hall_id).first().hall_capacity
            if show.capacity is None:
                booking = Booking(user_id=user_id,venue_id=venue_id,show_id=show_id,total_seat=data["total_seat"],booked_on=datetime.datetime.now(),booked_for=data["booked_for"])
                
                show.capacity = data["total_seat"]
                print(show.capacity)
                db.session.add(booking)
                db.session.commit()
            else:
                capacity = hall_capacity-show.capacity
                print(capacity)
                print("hiuser")
                if capacity>=int(data["total_seat"]):

                    booking = Booking(user_id=user_id,venue_id=venue_id,show_id=show_id,total_seat=data["total_seat"],booked_on=datetime.datetime.now(),booked_for=data["booked_for"])
                    
                    show.capacity+=int(data["total_seat"])
                    db.session.add(booking)
                    db.session.commit()
                else:
                    return jsonify({"error":"Seats not available","code":"null"})
                
            
            return jsonify({"created": "true","errorMessage": "null"})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            print(e)
            return jsonify({'error': 'opps something went wrong',"code":500})
class DeleteBooking(Resource):
    def delete(self,booking_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})


            booking = Booking.query.filter_by(booking_id=booking_id).first()
            total_seat = booking.total_seat
            show = Show.query.filter_by(show_id=booking.show_id).first()
            show.capacity-=total_seat
            
            db.session.delete(booking)
            db.session.commit()
                
           
            response = {"message" : "successfully deleted"}
            return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class DeleteUser(Resource):
    def delete(self):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            user_id=payload["user_id"]

           
            

            user = User.query.filter_by(user_id=user_id).first()
            bookings = Booking.query.filter_by(user_id=user_id).all()
            db.session.delete(user)
            for booking in bookings:
                db.session.delete(booking)
            db.session.commit()
                
           
            response = {"message" : "successfully deleted"}
            return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class DeleteAdmin(Resource):
    def delete(self):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            admin_id=payload["admin_id"]

           
            

            admin = Admin.query.filter_by(admin_id=admin_id).first()
            venue_list = Venue.query.filter_by(admin_id=admin_id).all()
            for venue in venue_list:
                halls = Hall.query.filter_by(venue_id=venue.venue_id).all()
                for hall in halls:
                    db.session.delete(hall)
                db.session.delete(venue)
            db.session.delete(admin)
            db.session.commit()
                
           
            response = {"message" : "successfully deleted"}
            return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class DeleteVenue(Resource):
    def delete(self,venue_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})


            venue = Venue.query.filter_by(venue_id=venue_id).first()
            shows = Show.query.filter_by(venue_id=venue_id).all()
            halls = Hall.query.filter_by(venue_id=venue_id).all()
            
            db.session.delete(venue)
            for show in shows:
                db.session.delete(show)
            for hall in halls:
                db.session.delete(hall)
            db.session.commit()
                
           
            response = {"message" : "successfully deleted"}
            return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            print(e)
            return jsonify({'error': 'opps something went wrong',"code":500})
class DeleteHall(Resource):
    def delete(self,hall_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})


            hall = Hall.query.filter_by(hall_id=hall_id).first()
            shows = Show.query.filter_by(hall_id=hall_id).all()
            
            db.session.delete(hall)
            for show in shows:
                db.session.delete(show)
            db.session.commit()
                
           
            response = {"message" : "successfully deleted"}
            return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class DeleteShow(Resource):
    def delete(self,show_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})


            show = Show.query.filter_by(show_id=show_id).first()
            hall = Hall.query.filter_by(hall_id=show.hall_id).first()
            hall.status = "NOT OCCUPIED"
            db.session.delete(show)
            db.session.commit()
                
           
            response = {"message" : "successfully deleted"}
            return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            return jsonify({'error': 'opps something went wrong',"code":500})  
class AdminEditProfile(Resource):
    def put(self):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            admin_id = payload["admin_id"]
            
            data=request.get_json()
            admin = Admin.query.get(admin_id)
            if "name" in data and len(data['name'])>0:
                admin.name=data["name"]
            if "adminname" in data and len(data['adminname'])>0:
                admin.adminname=data["adminname"]
            if "email_id" in data and len(data['email_id'])>0:  
                admin.email_id=data["email_id"]
            if "password" in data and len(data['password'])>0:
                hashed_password = bcrypt.generate_password_hash(data['password'])
                admin.password=hashed_password
            db.session.commit()
            print("updated")
            return jsonify({"updated": "true","errorMessage": "null"})
        
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class UserEditProfile(Resource):
    def put(self):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            user_id = payload["user_id"]
            
            data=request.get_json()
            user = User.query.get(user_id)
            if "name" in data and len(data['name'])>0:
                user.name=data["name"]
            if "username" in data and len(data['username'])>0:
                user.username=data["username"]
            if "email_id" in data and len(data['email_id'])>0:  
                user.email_id=data["email_id"]
            if "mobile_no" in data and len(data['mobile_no'])>0:  
                user.mobile_no=data["mobile_no"]
            if "password" in data and len(data['password'])>0:
                hashed_password = bcrypt.generate_password_hash(data['password'])
                user.password=hashed_password
            db.session.commit()
            print("updated")
            return jsonify({"updated": "true","errorMessage": "null"})
        
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class EditVenue(Resource):
    def get(self,venue_id):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            admin_id = payload["admin_id"]
            if not admin_id:
                return jsonify({"error": "adminID are required"})
            venue = Venue.query.filter_by(venue_id=venue_id).first()
            return jsonify({"venue_id":venue_id, "venue_name":venue.venue_name, "place":venue.place,"location": venue.location})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            print(e)
            return jsonify({'error': 'opps something went wrong',"code":500})
    def put(self,venue_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            admin_id = payload["admin_id"]
            
            data=request.get_json()
            venue = Venue.query.filter_by(venue_id=venue_id).first()
            
            if "venue_name" in data and len(data['venue_name'])>0:
                venue.venue_name=data["venue_name"]
            if "place" in data and len(data['place'])>0:    
                venue.place=data["place"]
            if "location" in data and len(data['location'])>0:
                venue.location=data["location"]
            db.session.commit()
        
            return jsonify({"updated": "true","errorMessage": "null"})
        
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            print(e)
            return jsonify({'error': 'opps something went wrong',"code":500})
class EditHall(Resource):
    def get(self,hall_id):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            admin_id = payload["admin_id"]
            if not admin_id:
                return jsonify({"error": "adminID are required"})
            hall = Hall.query.filter_by(hall_id=hall_id).first()
            return jsonify({"hall_id":hall_id, "hall_capacity":hall.hall_capacity})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            print(e)
            return jsonify({'error': 'opps something went wrong',"code":500})
    def put(self,hall_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            admin_id = payload["admin_id"]
            
            data=request.get_json()
            hall = Hall.query.get(hall_id)
            
            
            if "hall_capacity" in data and len(data['hall_capacity'])>0:
                hall.hall_capacity=data["hall_capacity"]
            db.session.commit()
        
            return jsonify({"updated": "true","errorMessage": "null"})
        
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class EditShow(Resource):
    def get(self,show_id):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            admin_id = payload["admin_id"]
            if not admin_id:
                return jsonify({"error": "adminID are required"})
            show = Show.query.filter_by(show_id=show_id).first()
            hall_capacity = Hall.query.filter_by(hall_id=show.hall_id).first().hall_capacity
            capacity = hall_capacity-show.capacity
            venue_name = Venue.query.filter_by(venue_id=show.venue_id).first().venue_name
            if capacity<0:
                capacity = 0

            print({"show_id":show_id, "show_name":show.show_name, "timing": show.timing,"tag": show.tag, "price": show.price,"rating":show.rating,"total_rating":show.total_rating,"capacity":capacity,"poster_url":show.poster_url,"venue_id":show.venue_id,"venue_name":venue_name})
            return jsonify({"show_id":show_id, "show_name":show.show_name, "timing": show.timing,"tag": show.tag, "price": show.price,"rating":show.rating,"total_rating":show.total_rating,"capacity":capacity,"poster_url":show.poster_url,"venue_id":show.venue_id,"venue_name":venue_name})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            return jsonify({'error': 'opps something went wrong',"code":500})
    def put(self,show_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            admin_id = payload["admin_id"]
            
            data=request.get_json()
            show = Show.query.get(show_id)
            
            if "show_name" in data and len(data["show_name"])>0:
                show.show_name=data["show_name"]
            if "timing" in data and len(data["timing"])>0:
                show.timing=data["timing"]
            if "tag" in data and len(data["tag"])>0:
                show.tag=data["tag"]
            if "price" in data and data["price"]>0:
                show.price=data["price"]
            db.session.commit()
        
            return jsonify({"updated": "true","errorMessage": "null"})
        
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class GetDetails(Resource):
    def get(self):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            user_id = payload["user_id"]
            if not user_id:
                return jsonify({"error": "userID are required"})
            shows = []
            venues = []
            
            venues_details = Venue.query.order_by(func.random()).all()
            for venue in venues_details:
                venues.append({"venue_id":venue.venue_id,"venue_name":venue.venue_name,"place":venue.place,"location":venue.location})
            shows_details = Show.query.order_by(func.random()).all()
            for show in shows_details:
                shows.append({"show_id":show.show_id,"show_name":show.show_name,"poster_url":show.poster_url,"tag":show.tag,"rating":show.rating,"total_rating":show.total_rating,"price":show.price})
            return jsonify({"user_id":user_id, "shows":shows, "venues":venues})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            print(e)
            return jsonify({'error': 'opps something went wrong',"code":500})
class ShowDetails(Resource):
    def get(self,show_id):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            user_id = payload["user_id"]
            if not user_id:
                return jsonify({"error": "userID are required"})
            capacity = 0
            show = Show.query.filter_by(show_id=show_id).first()
            hall_capacity = Hall.query.filter_by(hall_id=show.hall_id).first().hall_capacity
            show_capacity = show.capacity
            if show_capacity is None:
                capacity = hall_capacity
            else:
                capacity = hall_capacity-show_capacity
            
            print(capacity)
            venue_name = Venue.query.filter_by(venue_id=show.venue_id).first().venue_name
            if capacity<0:
                capacity = 0
            rating = 0
            if show.total_rating>0:
                rating = show.rating/show.total_rating
            return jsonify({"show_id":show_id, "show_name":show.show_name, "timing": show.timing,"tag": show.tag, "price": show.price,"rating":rating,"total_rating":show.total_rating,"capacity":capacity,"poster_url":show.poster_url,"venue_id":show.venue_id,"venue_name":venue_name})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            return jsonify({'error': 'opps something went wrong',"code":500})
        
    def put(self,show_id):
        try:
            
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            user_id = payload["user_id"]
            
            data=request.get_json()
            show = Show.query.get(show_id)
            print(data)
            print(show)
            if "new_rating" in data:
                print("hi12")

                show.rating+=int(data["new_rating"])
                print(show.rating)
                show.total_rating+=1
            db.session.commit()
        
            return jsonify({"updated": "true","errorMessage": "null"})
        
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class VenueShow(Resource):
    def get(self,venue_id):
        try:
            token = request.headers.get("x-access-token")
            if not token:
                return jsonify({"error": "Access token is missing","code":401})
            try:
                payload = Validate_and_generate_token.validate(token=token)
                print("this is payload",payload)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired","code":498})
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token","code":498})

            
            user_id = payload["user_id"]
            if not user_id:
                return jsonify({"error": "userID are required"})
            shows = []

            shows_details = Show.query.filter_by(venue_id=venue_id).all()
            print(shows_details)
            venue_details = Venue.query.filter_by(venue_id=venue_id).first()
            for show in shows_details:
                shows.append({"show_id":show.show_id,"show_name":show.show_name,"poster_url":show.poster_url,"tag":show.tag,"rating":show.rating,"total_rating":show.total_rating,"price":show.price})
            return jsonify({"user_id":user_id, "shows":shows,"venue_name":venue_details.venue_name})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            print(e)
            return jsonify({'error': 'opps something went wrong',"code":500})