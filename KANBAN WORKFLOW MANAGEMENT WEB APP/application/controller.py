from flask import Flask, render_template, url_for, redirect, session,request,flash 

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField,  DateField, SelectField
from wtforms.validators import InputRequired, Length, ValidationError,DataRequired,Regexp,EqualTo
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_user, LoginManager, login_required, logout_user
from flask import current_app as app
from .database import db
from application.models import User,List,Card
from matplotlib import pyplot as plt
from datetime import datetime
app.config['SECRET_KEY']='itsasecret'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

uid=0

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))



class RegisterForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=2, max=64),Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0,'Usernames must have only letters, numbers, dots or ''underscores')], render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[InputRequired(), Length(min=8, max=20),Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0,'Password must have only letters, numbers, dots or ''underscores')], render_kw={"placeholder": "Password"})
    cpwd = PasswordField(
        validators=[
            InputRequired(),
            Length(8, 72),
            EqualTo("password", message="Passwords must match."),
        ], render_kw={"placeholder": "Confirm Password"}
    )    
    submit = SubmitField('Register')

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(
            username=username.data).first()
        if existing_user_username:
            flash("This username already exists. Please choose a different one.")
            
                


class AddlistForm(FlaskForm):
    lname=StringField(validators=[DataRequired(), Length(2, 64)], render_kw={"placeholder": "List Name"})
    ldescription=StringField(validators=[DataRequired(), Length(2, 64)], render_kw={"placeholder": "List description"})
    submit = SubmitField('save')


class AddCardForm(FlaskForm):
    ctitle=StringField(validators=[DataRequired(), Length(2, 64)], render_kw={"placeholder": "Card Title"})
    ccontent=StringField('Text', render_kw={"rows": 70, "cols": 11,"placeholder": "Content"})
    deadline=DateField(validators=[], render_kw={"placeholder": "Card Deadline"})
    submit = SubmitField('save')

class LoginForm(FlaskForm):
    username = StringField(validators=[DataRequired(), Length(2, 64)], render_kw={"placeholder": "Username"})
    password = PasswordField(validators=[InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})
    submit = SubmitField('Log In')



@app.route('/')
def home():
    return render_template('home.html')
  


@app.route('/login', methods=['GET', 'POST'])
def login():
    app.logger.info("Inside Login")
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if user.password== form.password.data:
                login_user(user)
                session['username'] = form.username.data
                session['user_id'] = user.id
                
                uid=session['user_id']

                return redirect(url_for('dashboard'))
            else:
                flash("RE-enter the password")
        else:
            flash("This user does not exist")
    return render_template('login.html', form=form)

@app.route('/dashboard/abc', methods=['GET', 'POST'])   
def exe():
    return f'404 : pagenotfound'

@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    app.logger.info("Inside Dashboard")
    list = List.query.filter_by(user_id=session['user_id']).all()
    card= db.session.query(Card).join(List).all()
    g=len(card)
    

    return render_template('dashboard.html',list=list,card=card,g=g)    


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@ app.route('/register', methods=['GET', 'POST'])
def register():
    app.logger.info("Inside Register")
    form = RegisterForm()

    if form.validate_on_submit():
        
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            flash("This username already exist")
        else:
            hashed_password = form.password.data
            new_user = User(username=form.username.data, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('login'))

        

    return render_template('register.html', form=form)

@ app.route('/addList', methods=['GET', 'POST'])
def addList(): 
    
    app.logger.info("Inside Add new list "+session ['username'])
    form=AddlistForm()
    
    if request.method == "POST":
        existing_user_lname =List.query.filter_by(user_id=session["user_id"]).all()
        
       
        if len(existing_user_lname)>=5:
            flash("you cannot have more than 5 list either edit or delete")
            return redirect(url_for('dashboard'))

        elif len(existing_user_lname)<5 :
            
            for i in range(0,len(existing_user_lname)):
                if existing_user_lname[i].list_name==form.lname.data:
                    flash("This list already exist")
                    return render_template('addList.html',form=form)
                else:
                    continue

            
            new_list = List(user_id=session["user_id"],list_name=form.lname.data, list_description=form.ldescription.data)
            db.session.add(new_list)
            db.session.commit()
            app.logger.info(" new List id "+ str( new_list.id)+" is added")
            return redirect(url_for('dashboard'))
        else:
            return render_template('addList.html',form=form)
    
    else:
        return render_template('addList.html',form=form)


@ app.route('/addCard', methods=['GET', 'POST'])
def addCard(): 
    app.logger.info("Inside Add new Card ")
    form=AddCardForm()
    
    if request.method=='POST':
        statuss=request.form.get('mystatus')
        if statuss==None:
            statuss=0
        
        mylistid=request.form.get('mylist')
        if mylistid==None:
            mylistid=0
        
        
        present = datetime.now()

        if statuss=="1":
            completed = datetime.now()
             
            complete  = completed.strftime("%Y-%m-%d")
        else:
            complete=None

        
        clistname=int(mylistid)
        lid=0
        listi=List.query.filter_by(user_id=session["user_id"]).all()

        for i in range(0,len(listi)):
            if listi[i].id==clistname:
                lid=listi[i].id
                

                
                
                new_card = Card(list_id=lid, title = form.ctitle.data, content = form.ccontent.data, deadline = form.deadline.data, status = statuss,start_date =present,complete_date=complete )
                db.session.add(new_card)
                db.session.commit()
                app.logger.info(" new Card id "+ str(new_card.id)+" is added")

        if lid==0:
            flash("Please select the list")
            return redirect(url_for('dashboard'))

        else:
            return redirect(url_for('dashboard'))
    
    listi=List.query.filter_by(user_id=session["user_id"]).all()
    g=len(listi)
    
    return render_template('addCard.html',form=form,listi=listi,g=g)


@app.route('/delete/<int:id>',methods=['GET','POST'])
def delete(id):
    app.logger.info("Inside delete list")
    deleted_list = List.query.filter_by(id=id).all()
    delete_card=Card.query.filter_by(list_id=id).all()
    for o in deleted_list:
        db.session.delete(o)
        db.session.commit()
        app.logger.info(" List id "+ str(id)+" is deleted")
    for n in delete_card:
        db.session.delete(n)
        db.session.commit()

    return redirect('/dashboard')


@app.route('/DeleteCard/<int:id>',methods=['GET','POST'])
def DeleteCard(id):
    app.logger.info("Inside delete card")
    deleted_card = Card.query.filter_by(id=id).all()
    for i in deleted_card:
        db.session.delete(i)
        db.session.commit()
        app.logger.info(" Card id "+ str(id)+" is deleted")

    return redirect('/dashboard')


@app.route('/ConfirmCard/<int:id>',methods=['GET','POST'])
def ConfirmCard(id):
    app.logger.info("Inside confirmation to delete card")
    return render_template('confirmcard.html',id=id)

@app.route('/ConfirmList/<int:id>',methods=['GET','POST'])
def ConfirmList(id):
    app.logger.info("Inside confirmation to delete list")
    return render_template('confirmlist.html',id=id)






@app.route('/UpdateList/<int:id>',methods=['GET','POST'])
def UpdateList(id):
    app.logger.info("Inside update list")
    userlist=List.query.filter_by(user_id=session["user_id"]).all() 
    updateList = List.query.filter_by(id=id).first()   
    beforeupdate=updateList.list_name
    
    if request.method=='POST':
        form = AddlistForm(formdata=request.form,obj=updateList)
        list_name=form.lname.data
        list_description=form.ldescription.data
        if(beforeupdate==list_name):
                    db.session.query(List).filter(id ==List.id).update({List.list_description:list_description }, synchronize_session = False)
                    db.session.commit()
                    app.logger.info(" List id "+ str(id)+" is updated")
                    return redirect('/dashboard')
        else:
            for i in range(0,len(userlist)):
                
                if userlist[i].list_name==list_name:
                    
                    flash("This list already exist")
                    return redirect('/dashboard')
                else:
                    continue      
            db.session.query(List).filter(id ==List.id).update({List.list_name:list_name,List.list_description:list_description }, synchronize_session = False)      
            db.session.commit()
            return redirect('/dashboard')
   
    name=updateList.list_name
    description=updateList.list_description
    form=AddlistForm(obj=updateList)
    return render_template('addListedit.html',name=name,description=description,form=form)





@app.route('/UpdateCard/<int:id>',methods=['GET','POST'])
def UpdateCard(id):
    app.logger.info("Inside update card")
    updatecard = Card.query.filter_by(id=id).first()   
    
    if request.method=='POST':
        form = AddCardForm(formdata=request.form,obj=updatecard)
        mylistid=request.form.get('mylist')
        if mylistid==None:
            mylistid=0

        
        
        clistname=int(mylistid)

        
        listi=List.query.filter_by(user_id=session["user_id"]).all()
        lid=0

        statuss=request.form.get('mystatus')
        if statuss==None:
            statuss=0
            

        for i in range(0,len(listi)):
            if listi[i].id==clistname:
                lid=listi[i].id
            else:
                continue

        if lid==0:
            flash("The list you entered does not exist")
            return redirect(url_for('dashboard'))
            
        if statuss=="1":
            completed = datetime.now()
             
            complete  = completed.strftime("%Y-%m-%d")
        else:
            complete=None
        


        title = form.ctitle.data
        content = form.ccontent.data
        deadline = form.deadline.data
        
        db.session.query(Card).filter(id ==Card.id).update({Card.list_id:lid,Card.title:title,Card.content:content,Card.deadline:deadline,Card.status:statuss,Card.complete_date:complete }, synchronize_session = False)
        db.session.commit()
        app.logger.info(" Card id "+ str(id)+" is updated")
        return redirect('/dashboard')

       
    lisID=updatecard.list_id
    lis=List.query.filter_by(id=lisID).first()
    listi=List.query.filter_by(user_id=session["user_id"]).all()
    g=len(listi)
    
    title = updatecard.title
    content = updatecard.content
    deadline = updatecard.deadline
    status = updatecard.status
    

    form=AddCardForm(obj=updatecard)
    return render_template('addcardedit.html',title=title,content=content,deadline=deadline,status=status,lis=lis,listi=listi,g=g,form=form)


@ app.route('/taskcomp', methods=['GET', 'POST'])
def taskcomp():
    app.logger.info("Inside task completion summary")
    list = List.query.filter_by(user_id=session['user_id']).all()
    l=len(list)
    card= db.session.query(Card).join(List).filter(List.user_id ==session['user_id'] ).all()
    g=len(card)
    
    deadline_lis=[]
    passed=0
    dstatus=0

    status=0
    
    present = datetime.now()
    for n in range(0,g):
        status=status+int(card[n].status)
        
        format = '%Y-%m-%d' 
        if card[n].deadline!=None:
            datetime_str = datetime.strptime(card[n].deadline, format)
        else:
            continue
        
 
        if datetime_str < present:
            passed=passed+1
            deadline_lis.append(card[n].deadline)
            dstatus=dstatus+int(card[n].status)
        

    if g!=0:
            dstatus=round(100*dstatus/len(deadline_lis),2)
    else:
            flash("No Cards on dashboard")    
            return redirect('/summary')    
    

    if g!=0:
        perc= round(status*100/g,2)
        st=['completed: '+str(perc)+'%', 'not completed: '+str(100-perc)+'%']
        data=[perc,100-perc ]
        fig = plt.figure(figsize =(5.5, 3.5))
        plt.pie(data, labels = st)
        fig.savefig('static/graph.png')
        fig.show()
    else:
        
        flash("No Cards on dashboard")    
        return redirect('/summary')  

    li_status=0
    li_for_all=[]
    li_names=[]
    total_card=0
    lis=[]
    lis_tot=[]


    for i in range(0,l):
        for n in range(0,g):
            if(list[i].id==card[n].list_id):
                total_card=total_card+1
                li_status=li_status+int(card[n].status)
        lis.append(li_status)
        lis_tot.append(total_card)
        if total_card!=0:
            li_for_all.append(round(li_status*100/total_card,2))
        else:
            li_for_all.append(0)
            
        li_status=0
        total_card=0
        li_names.append(list[i].list_name)
    return render_template("taskcompleted.html",status=status,g=g,li_for_all=li_for_all,li_names=li_names,lis=lis,lis_tot=lis_tot,passed=passed,dstatus=dstatus)



@ app.route('/tasktrend', methods=['GET', 'POST'])
def tasktrend():
    app.logger.info("Inside task trend summary")
    card= db.session.query(Card).join(List).filter(List.user_id ==session['user_id'],Card.status=="1" ).order_by(Card.complete_date.asc()).all()
    status1=0
    lis_deadline=[]
    unique_list=[]
    lis_status=[]
    for n in range(0,len(card)):
        if card[n].complete_date!=None:
            lis_deadline.append(card[n].complete_date)
        else:
            continue


    for x in lis_deadline:
       
        if x not in unique_list:
            unique_list.append(x)


    for i in range(0,len(unique_list)):
        for n in range(0,len(card)):
            if card[n].complete_date!=None:
                if unique_list[i]==card[n].complete_date:
                   status1=status1+int(card[n].status)
        lis_status.append(status1)
        status1=0

    
    
    fig = plt.figure(figsize = (9, 4.5))
    plt.bar(unique_list, lis_status, color ='maroon',
        width = 0.4)

    
    plt.xlabel("Date") 
    plt.ylabel("Task Completed")  
    plt.title("Date wise number of tasks Completed")  
      

    
    fig.savefig('static/graphb.png')
    fig.show()  

            


    
    return render_template('tasktrend.html')







@app.route('/summary')
def summary():
    app.logger.info("Inside summary")
    return render_template('summary.html')

#print

         