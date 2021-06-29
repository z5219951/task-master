# standard library imports
import random

# third-party imports
from flask import Flask, request, jsonify
import json
from flask_mail import Mail, Message
from flask_restx import Resource, Api, fields, inputs, reqparse
from flask_cors import CORS
import sqlite3

# local imports
# from config import config

app = Flask(__name__)
cors = CORS(app)
api = Api(app,
          default="ClickDown",  # Default namespace
          title="Capstone Project COMP3900",  # Documentation Title
          description="This page contains all of the HTTP requests that we service.")  # Documentation Description

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": 'clickdown3900@gmail.com',
    "MAIL_PASSWORD": 'capstone123'
}

app.config.update(mail_settings)
mail = Mail(app)

#### HELPER FUNCTIONS ####
def email_exists(email):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  count(*)
            FROM    users
            WHERE   email = '{email}';
            """
    c.execute(query)
    count = c.fetchone()[0]

    if (count == 1):
        return True
    return False

def user_exists(username):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  count(*)
            FROM    users
            WHERE   username = '{username}';
            """
    c.execute(query)
    count = c.fetchone()[0]

    if (count == 1):
        return True
    return False


# Register an account
register_payload = api.model('register account', {
    "username": fields.String,
    "password": fields.String,
    "email": fields.String,
    "first_name": fields.String,
    "last_name": fields.String,
    "phone_number": fields.String,
    "company": fields.String,
})

@api.route('/register', methods=['POST'])
class Users(Resource):
    # Use received information to register an account
    @api.response(200, 'New account registered successfully')
    @api.response(400, 'Bad request')
    @api.doc(description="Register a new account")
    @api.expect(register_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True)
        parser.add_argument('password', required=True)
        parser.add_argument('email', required=True)
        parser.add_argument('first_name', required=True)
        parser.add_argument('last_name', required=True)
        parser.add_argument('phone_number', required=True)
        parser.add_argument('company', required=False, default=None)
        args = parser.parse_args()
        # print(args)

        username = args.username
        password = args.password
        email = args.email
        first_name = args.first_name
        last_name = args.last_name
        phone_number = args.phone_number
        company = args.company

        # if email is already registered, return false
        # DELETE THIS IF FRONTEND ALREADY CHECKS VALIDITY
        if (email_exists(email)):
            return {'message': f'A user with that email already exists',
                    'value': False}, 400
        if (user_exists(username)):
            return {'message': f'A user with that username already exists',
                    'value': False}, 400

        # at this point, all inputs should be valid
        # insert values into users table
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                INSERT INTO users (username, password, email, first_name, last_name, phone_number, company)
                VALUES ('{username}', '{password}', '{email}', '{first_name}', '{last_name}', '{phone_number}', '{company}');
                """
        c.execute(query)
        conn.commit()

        c.close()
        conn.close()

        return {'value': True}


# TODO: add email system
# Forgot password
forgot_payload = api.model('forgot password', {
    "email": fields.String
})

@api.route('/forgot_password', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully found user, recovery email sent')
    @api.response(400, 'Bad request')
    @api.doc(description="Forgot password")
    @api.expect(forgot_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        args = parser.parse_args()
        # print(args)

        email = args.email
        # return  false if no such user
        if (not email_exists(email)):
            return {'value': False},200
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        recovery = -1

        # generate recovery code
        while True:
            recovery = ''.join([str(random.randint(0, 999)).zfill(3) for _ in range(2)])
            
            query = f"""
                    SELECT  count(*)
                    FROM    users
                    WHERE   recovery = '{recovery}';
                    """
            c.execute(query)
            count = c.fetchone()[0]
            print(count)

            if (count == 0):
                break
        
        query = f"""
                UPDATE  users
                SET     recovery = '{recovery}'
                WHERE   email = '{email}';
                """
        c.execute(query)
        conn.commit()

        # send email with code
        with app.app_context():
            msg = Message(subject="Forgot your password?",
                          sender='clickdown3900@gmail.com',
                          recipients=[f"{email}"], 
                          body=f"Recovery code is {recovery}")
            mail.send(msg)

        c.close()
        conn.close()

        return {'value': True},200


# reset password
recovery_payload = api.model('recovery code', {
    "recovery": fields.Integer
})

@api.route('/reset_password_code', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully entered recovery code')
    @api.response(400, 'Bad request')
    @api.doc(description="Enter recovery code")
    @api.expect(recovery_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('recovery', required=True)
        args = parser.parse_args()

        recovery = args.recovery
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # is there a recovery code that matches?
        query = f"""
                SELECT  count(*)
                FROM    users
                WHERE   recovery = '{recovery}';
                """
        c.execute(query)
        count = c.fetchone()[0]
        print(count)

        if (count != 1):
            return {'value': False}, 200

        return {'value': True}, 200

new_pass_payload = api.model('new password', {
    "email": fields.String,
    "new_password": fields.String
})

@api.route('/reset_password', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully reset password')
    @api.response(400, 'Bad request')
    @api.doc(description="Enter new password")
    @api.expect(new_pass_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('new_password', required=True)
        args = parser.parse_args()
        print(args)

        email = args.email
        new_password = args.new_password
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # change the password and reset code
        query = f"""
                UPDATE  users
                SET     password = '{new_password}', recovery = null
                WHERE   email = '{email}';
                """
        c.execute(query)
        conn.commit()

        c.close()
        conn.close()

        return {'value': True},200


# TODO: redo function with proper login system
# login
login_payload = api.model('login info', {
    "email": fields.String,
    "password": fields.String
})

@api.route('/login', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully logged in')
    @api.response(400, 'Bad request')
    @api.doc(description="Enter email and password")
    @api.expect(login_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        args = parser.parse_args()

        email = args.email
        password = args.password
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # retrieve id using email and password
        query = f"""
                SELECT  id
                FROM    users
                WHERE   email = '{email}' and password = '{password}';
                """
        c.execute(query)
        id = c.fetchone()

        if (id is None):
            return {'id':''}, 200

        c.close()
        conn.close()
        data = {    
            'id': id[0],
        }
        return json.dumps(data),200


# TODO: redo function with proper logout system
# logout
logout_payload = api.model('logout info', {
    "id": fields.Integer
})

@api.route('/logout', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully logged out')
    @api.response(400, 'Bad request')
    @api.doc(description="Automatically logs out")
    @api.expect(logout_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        args = parser.parse_args()
        # print(args)

        id = args.id

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        # HOW TO IMPLEMENT LOGOUT???
        # store JWT in db maybe?
        
        c.close()
        conn.close()

        return {'value': True}


# get user info
@api.route('/user/<int:id>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully retrieved user info')
    @api.response(404, 'Not Found')
    @api.doc(description="Gets info for a user given their id")
    def get(self, id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, username, password, email, first_name, last_name, phone_number, company
                FROM    users
                WHERE   id = '{id}';
                """

        c.execute(query)
        data = c.fetchone()

        if (data is None):
            return {'message': f'User not found'}, 404

        resp =  {
            'id': f'{data[0]}',
            'username': f'{data[1]}',
            'password': f'{data[2]}',
            'email': f'{data[3]}',
            'first_name': f'{data[4]}',
            'last_name': f'{data[5]}',
            'phone_number': f'{data[6]}',
            'company': f'{data[7]}'
        }
        
        print(resp)
        c.close()
        conn.close()

        return json.dumps(resp)


# update user info
update_payload = api.model('update info', {
    "id": fields.String,
    "username": fields.String,
    "password": fields.String,
    "email": fields.String,
    "first_name": fields.String,
    "last_name": fields.String,
    "phone_number": fields.String,
    "company": fields.String,
})

@api.route('/update', methods=['PUT'])
class Users(Resource):
    @api.response(200, 'Successfully updated user info')
    @api.response(400, 'Bad Request')
    @api.doc(description="Updates info for a user")
    @api.expect(update_payload)
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('username', required=True)
        parser.add_argument('password', required=True)
        parser.add_argument('email', required=True)
        parser.add_argument('first_name', required=True)
        parser.add_argument('last_name', required=True)
        parser.add_argument('phone_number', required=True)
        parser.add_argument('company', required=False, default=None)
        args = parser.parse_args()
        # print(args)

        id = args.id
        username = args.username
        password = args.password
        email = args.email
        first_name = args.first_name
        last_name = args.last_name
        phone_number = args.phone_number
        company = args.company

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE  users
                SET     username = '{username}',
                        password = '{password}',
                        email = '{email}',
                        first_name = '{first_name}',
                        last_name = '{last_name}',
                        phone_number = '{phone_number}',
                        company = '{company}'
                WHERE   id = '{id}';
                """
        try:
            c.execute(query)
        except:
            c.close()
            conn.close()
            # split up username and email later
            return {'value': False}, 200

        conn.commit()
        
        c.close()
        conn.close()

        return {'value': True},200


# update user info
task_payload = api.model('task', {
    "owner": fields.Integer,
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "deadline": fields.String,
    "current_state": fields.String,
    "progress": fields.Integer,
    "time_estimate": fields.Integer
})

@api.route('/create_task', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully created task')
    @api.response(400, 'Bad Request')
    @api.doc(description="Creates a task with the given info")
    @api.expect(task_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('owner', required=True)
        parser.add_argument('title', required=True)
        parser.add_argument('description', required=True)
        parser.add_argument('creation_date', required=True)
        parser.add_argument('deadline', required=False)
        # parser.add_argument('labels', required=False)
        parser.add_argument('current_state', required=False, default='Not Started')
        parser.add_argument('progress', required=False, default=0)
        parser.add_argument('time_estimate', required=False)
        args = parser.parse_args()
        # print(args)

        owner = args.owner
        title = args.title
        description = args.description
        creation_date = args.creation_date
        deadline = args.deadline
        # labels = args.labels
        current_state = args.current_state
        progress = args.progress
        time_estimate = args.time_estimate

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                INSERT INTO tasks (owner, title, description, creation_date, deadline, current_state, progress, time_estimate)
                VALUES ('{owner}', '{title}', '{description}', '{creation_date}', '{deadline}', '{current_state}', '{progress}', '{time_estimate}');
                """
        c.execute(query)
        conn.commit()

        query = f"""
                SELECT  id
                FROM    tasks
                WHERE   owner = '{owner}'
                AND     title = '{title}'
                AND     description = '{description}';
                """
        c.execute(query)
        id = c.fetchone()[0]

        c.close()
        conn.close()

        return {'id': id},200


# get user info
@api.route('/user/<int:owner>/tasks', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully retrieved task info')
    @api.response(404, 'Not Found')
    @api.doc(description="Gets all tasks for a user given their id")
    def get(self, owner):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, progress, time_estimate
                FROM    tasks
                WHERE   owner = '{owner}';
                """

        print(query)
        c.execute(query)
        data = c.fetchone()
        task_list = []

        while (data is not None):
            task_info = {
                'id': f'{data[0]}',
                'owner': f'{data[1]}',
                'title': f'{data[2]}',
                'description': f'{data[3]}',
                'creation_date': f'{data[4]}',
                'deadline': f'{data[5]}',
                'labels': f'{data[6]}',
                'current_state': f'{data[7]}',
                'progress': f'{data[8]}',
                'time_estimate': f'{data[9]}'
            }
            task_list.append(task_info)
            data = c.fetchone()

        print(task_list)

        c.close()
        conn.close()

        return json.dumps({'tasks': task_list})

if __name__ == '__main__':
    # params = config()
    # conn = psycopg2.connect(**params)
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = 'drop table if exists users'
    c.execute(query)
    query = 'drop table if exists tasks'
    c.execute(query)
    # create table users
    query = """
            CREATE TABLE IF NOT EXISTS users (
                id              integer     primary key,
                username        text        unique not null,
                password        text        not null,
                email           text        unique not null,
                first_name      text        not null,
                last_name       text        not null,
                phone_number    text        not null,
                company         text        ,
                recovery        integer
            );
            """
    c.execute(query)
    query = f"""
                INSERT INTO users (username, password, email, first_name, last_name, phone_number, company)
                VALUES ('charles', '123456Qq', '1105282259@qq.com', 'Yue', 'Qi', '12345', '123');
                """
    c.execute(query)

    # create table tasks
    query = """
            CREATE TABLE IF NOT EXISTS tasks (
                id              serial      primary key,
                owner           integer     not null,
                title           text        not null,
                description     text        not null,
                creation_date   text        not null,
                deadline        text        ,
                labels          text        ,
                current_state   text        not null,
                progress        integer     ,
                time_estimate   integer     ,
                difficulty      text        ,
                foreign key     (owner)     references users (id)
            );
            """
    c.execute(query)
    conn.commit()

    # # insert test account
    # query = f"""
    #         INSERT INTO users (username, password, email, first_name, last_name, phone_number, company)
    #         VALUES ('asd', 'qwe', 'asd', 'asd', 'asd', '123124124', null);
    #         """
    # c.execute(query)
    # conn.commit()

    # # test retrieval
    # query = """
    #         select * from users;
    #         """
    # c.execute(query)
    # test = c.fetchall()
    # print(test)
    
    c.close()
    conn.close()

    app.run(debug=True)