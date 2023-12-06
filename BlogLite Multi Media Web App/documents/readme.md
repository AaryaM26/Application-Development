Application development two - BLOGLITE project

# Steps to run
-Backend
-Create your own virtual environment 
-install requirements from requirements.txt
-run main.py 
- In terminal powershell you can see server(ip address) in which the app is running.

-frontend 
-open cmd from the frontend folder
-then run this command `python -m http.server` 
-or open index.html in browser

# File structure 
-backend
- `db_directory` has the sqlite DB. 
- `application` is where our application code is
- `static` - `static` files folder which consist of images .
- `templates` - templates for celery tasks

-frontend
-components `has all the vue components`
-index-html `has router-view`
-router.js  `has router-link`



 
-backend
	├── application
    │   ├── config.py
    │   ├── operations.py
	│   	├──token_validation.py
	│   	├── database.py
	│   	├──workers.py
	│   	├── models.py
	│   	└── __pycache__
	│  
	├── db_directory
	│   └── bloglitenew.sqlite3
	├── main.py
	├── static
	│   ├── logo.png
	│   │   
	│   └── logo1.png
	└── templates 
		├── daily_reminder.html
		└── monthly_report.html

-frontend
    ├── components
	│   ├── addpost.js
	│	├── deletepost.js
	│	├── deleteprof.js
	│	├── editpost.js
	│	├── editprof.js
	│	├── feed.js
	│	├── followers.js
	│	├── following.js
	│	├── home.js
	│	├── login.js
	│	├── logout.js
	│	├── myprofile.js
	│	├── personaldetails.js
	│	├── readblog.js
	│	├── register.js
	│	└── search.js
	│	
	│	
	├── index.html
	└── router.js







Author
Aarya Chetan Motiwala
21f1003998

