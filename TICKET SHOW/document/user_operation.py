#/admin/login
def admin_login():
    """
    step1: fetch adminname and password from request.authorization
    step2: call a function to generate jwt token using secret key and admin ID
    step3: return admin ID and jwt token as a JSON response

    """
    pass

#/user/login
def user_login():
    """
    step1: fetch username and password from request.authorization
    step2: call a function to generate jwt token using secret key and user ID
    step3: return user ID and jwt token as a JSON response

    """
    pass

#/admin/registration
def admin_registration():
    """
    step0: x-access-token for authentication
    step1: fetch profile data from request.payload
    step2: check if any admin present with same adminname or not
    step3: A. on success create a profile in database and give success response as JSON
           B. on failure generate 406 not accepted response
 
    
    """
    pass

#/user/registration
def user_registration():
    """
    step0: x-access-token for authentication
    step1: fetch profile data from request.payload
    step2: check if any user present with same username or not
    step3: A. on success create a profile in database and give success response as JSON
           B. on failure generate 406 not accepted response
    step4: return JSON response
    
    """
    pass

#/user/show_search/{show_id}
def show_search():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch userID and show_search_string from query string
    step2: fetch all the show with matching string / sub string show_name as search_string
    step4: create and return response based on fetched result
    step5: return JSON

    """
    pass

#/user/venu_search/{show_id}
def venue_search():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch userID and venue_search_string from query string
    step2: fetch all the venue with matching string / sub string venue_name as search_string
    step4: create and return response based on fetched result
    step5: return JSON

    """
    pass

#/user/user_profile/{user_id}
def user_profile():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch user_id  from query string
    step2: fetch a user and its details from user table based on user ID
    step3: fetch all the bookings from the booking table using user_id
    step5: generate a json response and return

    """
    pass

#/admin/admin_profile/{admin_id}
def admin_profile():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch admin_id and MyadminID from query string
    step2: fetch a admin and its details from admin table based on admin ID
    step5: fetch all the venues and shows created by admin from the venue and show table using admin_id 
    step6: generate a json response and return
    step7: return JSON

    """
    pass

#/admin/addVenue
def add_venue():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch venue data from request.payload
    step3: populate the database table with the provided data
    step4: return JSON

    """
    pass

#/admin/addShow
def add_show():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch show data from request.payload
    step3: populate the database table with the provided data
    step4: return JSON

    """
    pass

#/user/bookShow
def book_show():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch booking data from request.payload
    step3: populate the database table with the provided data
    step4: return JSON

    """
    pass

#/user/deleteBooking/{bookng_id}
def delete_booking():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: authenticate and delete the booking
    step3: return JSON

    """
    pass

#/user/deleteUser/{user_id}
def delete_user():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: authenticate and delete the booking
    step2: return JSON

    """
    pass

#/admin/deleteAdmin/{admin_id}
def delete_admin():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: authenticate and delete the booking
    step2: return JSON

    """
    pass

#/admin/deleteVenue/{venue_id}
def delete_venue():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: authenticate and delete the booking
    step2: return JSON

    """
    pass

#/admin/deleteShow{show_id}
def delete_show():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: authenticate and delete the booking
    step2: return JSON

    """
    pass

#/admin/editVenue/{venue_id}
def edit_venue():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch venue data from request.payload
    step3: change the database with updated data
    step5: return JSON
    """
    pass

#/admin/editShow/{show_id}
def edit_show():
    """
    step0: fetch x-access-token from request header and validate token function
    step1: fetch show data from request.payload
    step3: change the database with updated data
    step4: return JSON
    """
    pass