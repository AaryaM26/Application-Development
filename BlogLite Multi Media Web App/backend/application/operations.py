
from flask import Flask, request,jsonify,make_response
import jwt
import datetime
from flask_sqlalchemy import SQLAlchemy
from application.token_validation import *
from flask import current_app as app
from .database import db
from application.models import User,user_prof,blogTable,user_relations
from flask_bcrypt import Bcrypt
from functools import wraps
from flask_restful import Resource
from application.cache import cache


bcrypt = Bcrypt(app)
class LoginRegistration(Resource):
    #/user/registration
    def post(self):
        try:
            data=request.get_json()
            hashed_password=bcrypt.generate_password_hash(data['password'])
            print(data['password'])
            username=data['username']
            print(username)
            user = User.query.filter_by(user_name=username).first()
            if user:
                print("entered if")
                response = {'error': 'This user already exists'}
                return make_response(jsonify(response), 400)
            else:
                new_user = User(user_name=data['username'], password=hashed_password,email_id=data['emailId'],mobile_num=data['mobileNumber'],Name=data['name'], first_login_time=datetime.datetime.now() )
                print("entered else")
                db.session.add(new_user)
                db.session.commit()
                response = {'message': 'New user created'}
                #user_pr=user_prof.query.get(blog_id)
                return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})

            




    def get(self):
        auth=request.authorization
        
        if not auth or not auth.username or not auth.password:
            return make_response('Could not verify',401,{'WWW-Authentikate': 'Basic realm = "Login Reqired!"'} )

        user = User.query.filter_by(user_name=auth.username).first()
        
        if not user:
            return make_response(jsonify({'error': 'no user found','code': 404}), 404)
        if bcrypt.check_password_hash(user.password, auth.password):

            token=Validate_and_generate_token.generate(user_id=user.user_id)
            user.prev_login=datetime.datetime.now()
            print(user.prev_login)
            db.session.commit()
            return make_response(jsonify({'userId':user.user_id,'token':token,'code': 200}),200)

        return make_response(jsonify({'error': 'INCORRECT PASSWORD','code': 401}), 401)

    


class UserSearch(Resource):

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
            user_id = payload["userID"]
            
            search_string = request.args.get("search_string")
            
            if not search_string:
                return jsonify({"error": "Search string is missing"})

           
            users = User.query.filter(User.user_name.like("%" + search_string + "%")).all()
            

            
            result = []
            for user in users:
                #print(type(user.user_id))
                user_follow = user_relations.query.filter_by(follower_id=user_id, user_id=user.user_id).first()
                
                if user_follow:
                    is_following = "true"
                else :
                    is_following = "false"
                
                if user_id==user.user_id:
                    isMe="true"
                else:
                    isMe="false"
                
                userprof= user_prof.query.filter_by( user_id=user.user_id).first()
                
                result.append({"userId": user.user_id,"isMe":isMe ,"username": user.user_name, "isFollowing": is_following,"dpLink" : userprof.profile_img_URL})

            
            return jsonify({"result": result,"code":200})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})

class GetBlog(Resource):
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

            
            userId = payload["userID"]
            user= User.query.get(userId )
            #fetch post data from request.payload
            data=request.get_json()

            blogs = blogTable(user_id=userId,title=data["title"],content=data["content"],blog_image_url=data["imageURL"],blog_timestamp=datetime.datetime.now(),blog_status=data["isPublic"],user_name=user.user_name )
            
            db.session.add(blogs)
            db.session.commit()
            
            return jsonify({"created": "true","errorMessage": "null"})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500}) 


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

            
            userId = payload["userID"]
            user= User.query.get(userId)
            blog_id = request.args.get("blog_id")
            
            data=request.get_json()
            print("hi",blog_id)
            blogs=blogTable.query.get(blog_id)
            
            


            blogs.user_id=userId
            
            if "title" in data:
                blogs.title=data["title"]
            print("data")
            if "caption" in data:    
                blogs.content=data["caption"]
            print("data")
            if "imageLink" in data:
                blogs.blog_image_url=data["imageLink"]
            print("data")
            blogs.blog_timestamp=datetime.datetime.now()
            print("data")

            if "isPublic" in data:
                blogs.blog_status=data["isPublic"]
            print(data["isPublic"])
            blogs.user_name=user.user_name 
            print("data")
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

           
            userId = payload["userID"]
            #userId = 3
            blog_id = request.args.get("blog_id")
            blogs=blogTable.query.get(blog_id)
            
            # step2: return JSON
            
            return jsonify({"title":blogs.title,"caption":blogs.content,"imageLink":blogs.blog_image_url,"isPublic":blogs.blog_status})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})

class userFeed(Resource):
    
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


            
            userId = payload["userID"]
            myusername=User.query.filter_by(user_id=userId).first()
            user_follower=user_relations.query.filter_by(follower_id=userId)
            follower_feed=[]
            print(myusername.user_name)
            for user in user_follower:
                user_blog=blogTable.query.filter_by(user_id=user.user_id,blog_status="1").all()

                for blog_feed in user_blog:
                    follower_feed.append({"userId":blog_feed.user_id, "username":blog_feed.user_name,"title":blog_feed.title,"caption":blog_feed.content,"imageLink":blog_feed.blog_image_url,"timeStamp":blog_feed.blog_timestamp})
                
          
            response = {"message":follower_feed,"username":myusername.user_name,"userid":myusername.user_id}
            return make_response(jsonify(response), 200)

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})  


class userProfile(Resource):
    
    
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

            
            userid=payload["userID"]
            print("hiiiii")
            
            #fetch profile data from request.payload to be edited 
            data=request.get_json()
            
            user= User.query.get(userid)
            print(user.password)
            print(data['password'])
            if(data['password']==""):
                hashed_password = user.password
            else:
                hashed_password = bcrypt.generate_password_hash(data['password'])
                user.password = hashed_password
            if(data['password']==""):
                hashed_password = user.password
            else:
                hashed_password = bcrypt.generate_password_hash(data['password'])
                user.password = hashed_password
            if(data["mobileNum"]==""):
                user.mobile_num = user.mobile_num
            else:
                user.mobile_num = data["mobileNum"]
            if(data["name"]==""):
                user.Name = user.name
            else:
                user.Name = data["name"]
            if(data["emailId"]==""):
                user.email_id = user.email_id
            else:
                user.email_id = data["emailId"]
            

           
            user_profile = user_prof.query.filter_by(user_id=userid).first()
            if user_profile:

                if "profileIMG" in data:
                    user_profile.profile_img_URL = data["profileIMG"]
                    
                
                
                
                db.session.commit()
                return jsonify({"updated": "true", "errorMessage": "null"})
            else:
                return jsonify({"error": "User profile not found"})
            

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
        
    @cache.memoize(timeout=40)
    def get(self):
        print("#####cache miss#####")
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

            
            user_id = payload["userID"]
            other_user_id = request.args.get("otherUserID")
            print("other_user_id ",other_user_id )
            if not user_id or not other_user_id:
                return jsonify({"error": "userID and otherUserID are required"})

            
            user = User.query.get(other_user_id)
            print("user:",user)
            if not user:
                return jsonify({"error": "User not found"})

            
            profile = user_prof.query.get(user_id)

            
            if str(user_id) != str(other_user_id):
                print("inside if")
                profile = user_prof.query.get(other_user_id)
                user_data = User.query.get(other_user_id)
                result=[]
                #print(result)
                posts = blogTable.query.filter_by(user_id=other_user_id,blog_status="1")
                
                user_follow = user_relations.query.filter_by(follower_id=user_id,user_id = other_user_id).first()
                if user_follow == None :
                    is_following = "false"
                else :
                    is_following = "true"  
                print(is_following)     
                for blog in posts:
                    result.append({"blogId":blog.blog_id,"title":blog.title,"caption":blog.content,"imageLink":blog.blog_image_url,"isPublic":blog.blog_status,"timeStamp":blog.blog_timestamp})
                return jsonify({"myuserid":user_id,"userId":profile.user_id,"Name":user_data.Name,"username":user_data.user_name,"imageLink":profile.profile_img_URL,"totalPost":profile.total_post,"followerCount":profile.followers_num,"followingCount":profile.following_count,"isMyProfile":"false","following":is_following,"result": result})

            else :
                #print("inside else")
                profile = user_prof.query.get(user_id)
                user_data = User.query.get(user_id)
                result=[]
                posts = blogTable.query.filter_by(user_id=user_id).all()
                #print(posts)
                    
                for blog in posts:
                    result.append({"blogId":blog.blog_id,"title":blog.title,"caption":blog.content,"imageLink":blog.blog_image_url,"isPublic":blog.blog_status,"timeStamp":blog.blog_timestamp})
                    #print(result)
                return jsonify({"myuserid":user_id,"userId":profile.user_id,"Name":user_data.Name,"username":user_data.user_name,"imageLink":profile.profile_img_URL,"totalPost":profile.total_post,"followerCount":profile.followers_num,"followingCount":profile.following_count,"isMyProfile":"true","following":"true","result":result})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})


class userFollower(Resource):

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

            
            user_id = payload["userID"]
            other_user_id = request.args.get("otherUserID")
            if not user_id or not other_user_id:
                return jsonify({"error": "userID and otherUserID are required"})
                
            # step: check if userID is same as MyuserID 
            if str(user_id) == str(other_user_id):
                
                user_follow = user_relations.query.filter_by(user_id = other_user_id)
                result=[]
                for follower in user_follow :
                    follow_back = user_relations.query.filter_by(follower_id = follower.user_id,user_id=follower.follower_id).first()
                    userr=user_prof.query.filter_by(user_id = follower.follower_id).first()
                    if follow_back: 
                        is_following = "true"
                    else :
                        is_following = "false"

                    print("#########",is_following)
                    result.append({"userId":follower.user_id,"username":follower.user_name,"followerId":follower.follower_id,"follower_name":follower.follower_username,"isFollowing":is_following,"dpLink":userr.profile_img_URL})
            else: 
                user_follow = user_relations.query.filter_by(user_id = other_user_id)
                result=[]
                for follower in user_follow :
                    userr=user_prof.query.filter_by(user_id = follower.follower_id).first()
                    follow_back = user_relations.query.filter_by(follower_id =user_id,user_id=follower.follower_id).first()
                    print(follow_back)
                    if follow_back : 
                        is_following = "true"
                    else :
                        is_following = "false"
                    print(is_following)
                    
                        
                    result.append({"userId":follower.user_id,"username":follower.user_name,"follower_name":follower.follower_username,"followerId":follower.follower_id,"isFollowing":is_following,"dpLink":userr.profile_img_URL})
            
            return jsonify({"result":result})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})


class userFollowing(Resource):

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

            
            user_id = payload["userID"]
            other_user_id = request.args.get("otherUserID")
            print("ola")
            if not user_id or not other_user_id:
                return jsonify({"error": "userID and otherUserID are required"})
                
           
            if str(user_id) == str(other_user_id):
                print("inside if!")
                user_follow = user_relations.query.filter_by(follower_id = user_id).all()
                print(user_follow)
                result=[]
                for follower in user_follow :
                    userr=user_prof.query.filter_by(user_id = follower.user_id).first()
                    print(follower.user_id)
                    result.append({"userId":follower.user_id,"username":follower.user_name,"followerId":follower.follower_id,"isFollowing":"true","dpLink":userr.profile_img_URL})
                    print(result)
            else:  
                    
                print("inside else!") 
                user_follow = user_relations.query.filter_by(follower_id = other_user_id)
                result=[]
                for follower in user_follow :
                    follow_back = user_relations.query.filter_by(follower_id=user_id,user_id=follower.user_id).first()
                    print(follow_back)
                    userr=user_prof.query.filter_by(user_id = follower.user_id).first()
                    if follow_back : 
                        is_following = "true"
                    else :
                        is_following = "false"
                    print(is_following)
                    result.append({"userId":follower.user_id,"username":follower.user_name,"followerId":follower.follower_id,"isFollowing":is_following,"dpLink":userr.profile_img_URL})
            
            return jsonify({"result":result})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
              
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

           
            follower_id = payload["userID"]
            followee_id = request.args.get("otherUserID")
            if not follower_id or not followee_id:
                return jsonify({"error": "followerID and followeeID are required"})

            
            print(follower_id,"....",followee_id )
            print("helloooooo")
            existing_relation = user_relations.query.filter_by(follower_id=follower_id, user_id=followee_id).first()
            print(existing_relation)
            if (existing_relation!= None):
                # If the relation already exists, delete it
                db.session.delete(existing_relation)
                db.session.flush()
                is_following = "false"
                print("deleted")
            else:
                print("entered else")
                print("following")
                
                followerUsername=User.query.get(follower_id)
                userName=User.query.get(followee_id)
                new_relation = user_relations(follower_id=follower_id, user_id=followee_id,user_name=userName.user_name,follower_username=followerUsername.user_name)
                db.session.add(new_relation)
                is_following = "true"

            db.session.commit()

            return jsonify({"message": "Relation updated successfully", "isFollowing": is_following})

        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500}) 



class userProfileInfo(Resource):

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

            
            user_id =  payload["userID"]
            
            if not user_id :
                return jsonify({"error": "userID and otherUserID are required"})

            
            user = User.query.get(user_id)
            if not user:
                return jsonify({"error": "User not found"})

            
            profile = user_prof.query.get(user_id)

            
            
            profile = user_prof.query.get(user_id)
            user_data = User.query.get(user_id)
        
            return jsonify({"userId":user_data.user_id,"Name":user_data.Name,"username":user_data.user_name,"password":str(user_data.password),"emailId":user_data.email_id,"mobileNumber":user_data.mobile_num,"imageLink":profile.profile_img_URL})
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
class deleteProfile(Resource):
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

            
            userid=payload["userID"]

           
            

            user = User.query.filter_by(user_id=userid).first()
            
            db.session.delete(user)
            db.session.commit()
                
           
            response = {"message" : "successfully deleted"}
            return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})
    
class deletePost(Resource):
    def delete(self):
        try:
            # Step 0: Fetch the userID and search_string from the query string
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

            
            userid=payload["userID"]
            blogid = request.args.get("blog_id")

            #to make sure authorisation info is complete
            
            blog=blogTable.query.filter_by(blog_id=blogid).first()
            
            
            db.session.delete(blog)
            db.session.commit()
                
            #return({"message" : "successfully deleted"})
            response = {"message" : "successfully deleted"}
            return make_response(jsonify(response), 200)
        except KeyError:
            return jsonify({'error': 'Key not found in JSON data',"code":400})
            
        except TypeError:
            
            return jsonify({'error': 'Data is None or not iterable',"code":406})
        except Exception as e:
            
            return jsonify({'error': 'opps something went wrong',"code":500})



