from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

bp = Blueprint('taskboard', __name__, url_prefix='/taskboard')

# Need to check user permissions
# @bp.before_request
# def load_logged_user():

@bp.route('/', methods=('GET', 'POST'))
def search():
    if response.method == 'POST':
        # Search DB for tasks
        # search_str = request.form["search"]
        #tasks = 
        # return tasks
    
    # return render_template('Taskboard.html', tasks)


@bp.route('/new', methods=('GET', 'POST'))
def new_task():
    if response.method == 'POST':
        task_name = response.form['Name']
        description = response.form['description']
        ease = response.form['difficulty']
        cState = response.form['cState']
        dueD = response.form['dueD']
        startD = response.form['startD']
        prog = response.form['progress']
        timeEst = response.form['timeEst']
        
        return -1
    # return render_template
        
@bp.route('/update', methods=('GET', 'POST'))
def update():
    if response.method == 'POST':
        username = request.form['userName']
        password = request.form['passWord']
        email = request.form['email']
        first_name = request.form['firstName']
        last_name = request.form['lastName']
        phone_number = request.form['phone']
        company = request.form['company']
        
        return False
    

