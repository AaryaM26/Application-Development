Application development one - KANBAN project

# Steps to run
-Create your own virtual environment 
-install requirements from requirements.txt
-**Make sure not to delete any subfolder/file from static folder, app will manage that folder automatically**
-run main.py 
- Open KanbanAarya.log for logs and for server(ip address) in which the app is running.
- Paste the server link to the browser and explore.

# File structure 

- `db_directory` has the sqlite DB. 
- `application` is where our application code is
- `static` - `static` files folder like images and graphs.
- `templates` - Default flask templates folder
- `KanbanAarya` - log file



├── application
│   ├── config.py
│   ├── controllers.py
│   ├── database.py
│   ├── models.py
│   └── __pycache__
│       ├── config.cpython-38.pyc
│       ├── config.cpython-39.pyc
│       ├── controllers.cpython-38.pyc
│       ├── controllers.cpython-39.pyc
│       ├── database.cpython-38.pyc
│       ├── database.cpython-39.pyc
│       ├── models.cpython-38.pyc
│       └── models.cpython-39.pyc
├── db_directory
│   └── database.sqlite3
├── main.py
├── readme.md
├── static
│   ├── graph.png
│   │   
│   └── logo1.png
├── KanbanAarya.txt
└── templates 
    ├── addCard.html
	├── addcardedit.html
	├── addList.html
	├── addListedit.html
	├── confirmcard.html
	├── confirmlist.html
	├── home.html
	├── login.html
	├── dashboard.html
	├── register.html
	├── summary.html
	├── taskcompleted.html
    └── tasktrend.html


