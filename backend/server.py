# standard library imports
import random
import re

# third-party imports
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_restx import Resource, Api, fields, inputs, reqparse
import psycopg2
import sqlite3

# local imports
# from config import config

app = Flask(__name__)
api = Api(app,
          default="ClickDown",  # Default namespace
          title="Assignment 2",  # Documentation Title
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
    print(query)
    c.execute(query)
    count = c.fetchone()[0]
    print(count)

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
    print(query)
    c.execute(query)
    count = c.fetchone()[0]
    print(count)

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

        if (not email_exists(email)):
            return {'message': f'A user with that email does not exist',
                    'value': False}, 400
        
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
                WHERE   email = '{email}'
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

        return {'value': True}


# reset password
recovery_payload = api.model('recovery code', {
    "recovery": fields.Integer
})
new_pass_payload = api.model('new password', {
    "email": fields.String,
    "new_password": fields.String
})

@api.route('/reset_password', methods=['POST', 'PUT'])
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
            return {'message': f'Incorrect recovery code',
                    'value': False}, 400

        return {'value': True}

    @api.response(200, 'Successfully reset password')
    @api.response(400, 'Bad request')
    @api.doc(description="Enter new password")
    @api.expect(new_pass_payload)
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('new_password', required=True)
        args = parser.parse_args()
        # print(args)

        email = args.email
        new_password = args.new_password
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # change the password and reset code
        query = f"""
                UPDATE  users
                SET     password = '{new_password}', recovery = null
                WHERE   email = '{email}'
                """
        c.execute()
        conn.commit()

        c.close()
        conn.close()

        return {'value': True}


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
        # print(args)

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
            return {'message': f'Incorrect email or password'}, 400
        
        c.close()
        conn.close()

        return {f"'id': {id}"}


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

        id = args.id        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        # HOW TO IMPLEMENT LOGOUT???
        # store JWT in db maybe?

        return {'value': True}

userInfo_payload = api.model('user info', {
    "id": fields.Integer
})
@api.route('/userInfo', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully retrieved data')
    @api.response(400, 'Bad request')
    @api.doc(description="Return JSON of user data")
    @api.expect(userInfo_payload)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)        
        args = parser.parse_args()

        id = args.id
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        # Validate user?
        
        # retrieve user with given ID
        query = f"""
                SELECT  *
                FROM    users
                WHERE   id = '{id}';
                """
        c.execute(query)
        row = c.fetchone()
        
        if row is none:
            return {'message': f'User ID not found or not authorised'}, 400
        
        # Is this correct, check type of row?
        return row
        

@api.route('/updateUser', methods=['PUT'])
class Users(Resource):
    @api.response(200, 'Successfully updated')
    @api.response(400, 'Bad request')
    @api.doc(description="Update user database")
    @api.expect(register_payload)
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('userName', required=True)
        parser.add_argument('passWord', required=True)
        parser.add_argument('email', required=True)
        parser.add_argument('firstName', required=True)
        parser.add_argument('lastName', required=True)
        parser.add_argument('phone', required=True)
        parser.add_argument('company', required=False, default=None)
        args = parser.parse_args()
    
        id = args.id
        username = args.userName
        password = args.passWord
        email = args.email
        first_name = args.firstName
        last_name = args.lastName
        phone_number = args.phone
        company = args.company
        
        # Validate user
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE users 
                SET (username = {username}, password = {password}, email={email}, first_name={firstName}, last_name={lastName}, phone_number={phone}, company={company})
                where id={id};
                """
        c.execute(query)
                
        return {'value': True}

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
                current_state   state       not null,
                progress        integer     ,
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