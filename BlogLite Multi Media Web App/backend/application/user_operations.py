


#/user/login
#done
def user_login():
    """
    step1: fetch username and password from request.authorization
    step2: call a function to generate jwt token using secret key and user ID
    step3: return user ID and jwt token as a JSON response

    """
    pass

#/user/registration
#done
def user_register():
    """
    step1: fetch profile data from request.payload
    step2: check if any user present with same username or not
    step3: A. on success create a profile in database and give success response as JSON
           B. on failure generate 406 not accepted response
    step4: return JSON response
    
    """
    pass

#/user/search/{userId}
#done
def user_search():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch userID and search_string from query string
    step2: fetch all the user with matching string / sub string username as search_string
    step3: fetched user is followed by current user or not
    step4: create and return response based on fetched result

    """
    pass
#/user/feed{userId}
#done
def user_feed():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch user ID of all the user followed by current user from user relation table
    step2: fetch all the public posts of the followed users from post table
    step3: generate a json response and return

    """

    pass
#/user/profile/{userId}
#done
def user_profile():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch userID and MyuserID from query string
    step2: fetch a user from user table based on user ID
    step3: fetch details from user profile table using user ID 
    step4: check if userID is same as MyuserID
    step5: fetch all the posts using userID 
    step6: generate a json response and return

    """
    pass
#/user/addPost
def add_post():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch post data from request.payload
    step2: check if image uploaded or not orelse upload default image
    step3: populate the database table with the provided data
    step4: increment count of total number of posts accordingly

    """
    pass
#/user/followers/{userId}
#done
def user_followers():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch userID and MyuserID from query string
    step2: check if userID is same as MyuserID
    step3: A.fetch all users from user table
    step4: A.fetch all the userID from user relation where followerID = my user ID
    step5: fetch dpLink from user profile
    step6: process and filter and return JSON

    """
    pass
#/user/following/{userId}
#done
def user_following():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch userID and MyuserID from query string
    step2: check if userID is same as MyuserID
    step3: A.fetch all users from user table
    step4: A.fetch all the userID from user relation where followerID = my user ID
    step5: fetch dpLink from user profile
    step6: process and filter and return JSON

    """
    pass
#/user/getPost/{postId}
#done
def get_post():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch postID
    step2: return JSON
    """
    pass
#/user/editPost/{postId}
def edit_post():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch post data from request.payload
    step2: check if image updated
    step3: if update upload new image else change everything else
    step4: return JSON
    """
    pass
#/user/profileInfo/{userId}
#done
def profile_Info():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch profile info also the dpLink
    step3: return JSON

    """
    pass

#/user/profileInfo/{userId}
def editprofile_Info():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch profile info also the dpLink from reponse body
    step2: check if dp image updated or not and do changes accordingly
    step3: return JSON

    """
    pass
#/user/deleteProfile/{userId}
#done
def delete_profile():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: authenticate and delete the profile
    step3: return JSON

    """
    pass

