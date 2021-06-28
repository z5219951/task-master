# standard library imports
import random
import re

# third-party imports
from flask import Flask, request, jsonify, Mail, Message
from flask_restx import Resource, Api, fields, inputs, reqparse
import psycopg2

# local imports
from config import config

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
    # regex = '\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b'
    # if (re.search(regex, email)):
    #     return True
    # else:
    #     return False
    conn = psycopg2.connect(config())
    c = conn.cursor()

    query = f"""
            SELECT  count(*)
            FROM    users
            WHERE   email = {email};
            """
    c.execute(query)
    count = c.fetchone()
    print(count)

    if (count == 1):
        return True
    return False


# Register an account
register_payload = api.model('register account', {
    "username": fields.String,
    "password": fields.String,
    "email": fields.String,
    "first name": fields.String,
    "last name": fields.String,
    "phone number": fields.String,
    "company": fields.String,
})

@api.route('/clickdown/register', methods=['POST'])
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
        parser.add_argument('first name', required=True)
        parser.add_argument('last name', required=True)
        parser.add_argument('phone number', required=True)
        parser.add_argument('company', required=False, default=None)

        username = request.args.get('username')
        password = request.args.get('password')
        email = request.args.get('email')
        first_name = request.args.get('first name')
        last_name = request.args.get('last name')
        phone_number = request.args.get('phone number')
        company = request.args.get('company')

        # if email is already registered, return false
        # DELETE THIS IF FRONTEND ALREADY CHECKS VALIDITY
        if (email_exists(email)):
            return {'message': f'A user with that email already exists',
                    'value': False}, 400

        # at this point, all inputs should be valid
        # insert values into users table
        conn = psycopg2.connect(config())
        c = conn.cursor()

        query = f"""
                INSERT INTO users
                VALUES (DEFAULT, {username}, {password}, {email}, {first_name}, {last_name}, {phone_number}, {company}, null);
                """
        c.execute(query)
        conn.commit()

        c.close()
        conn.close()

        return {'value': False}


# TODO: add email system
# Forgot password
forgot_payload = api.model('forgot password', {
    "email": fields.String
})

@api.route('/clickdown/forgot_password', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully found user, recovery email sent')
    @api.response(400, 'Bad request')
    @api.doc(description="Forgot password")
    @api.expect(forgot_payload)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)

        email = request.args.get('email')

        if (not email_exists(email)):
            return {'message': f'A user with that email does not exist',
                    'value': False}, 400
        
        conn = psycopg2.connect(config())
        c = conn.cursor()
        recovery = -1

        # generate recovery code
        while True:
            recovery = ' '.join([str(random.randint(0, 999)).zfill(3) for _ in range(2)])
            
            query = f"""
                    SELECT  count(*)
                    FROM    users
                    WHERE   recovery = {recovery};
                    """
            c.execute(query)
            count = c.fetchone()
            print(count)

            if (count == 0):
                break
        
        query = f"""
                UPDATE  users
                SET     recovery = {recovery}
                WHERE   email = {email}
                """
        c.execute()
        conn.commit()

        # send email with code
        with app.app_context():
            msg = Message(subject="Forgot your password?",
                        sender='clickdown3900@gmail.com',
                        recipients=f"{email}", 
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

@api.route('/clickdown/reset_password', methods=['GET', 'PUT'])
class Users(Resource):
    @api.response(200, 'Successfully entered recovery code')
    @api.response(400, 'Bad request')
    @api.doc(description="Enter recovery code")
    @api.expect(recovery_payload)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('recovery', required=True)

        recovery = request.args.get('recovery')
        
        conn = psycopg2.connect(config())
        c = conn.cursor()

        # is there a recovery code that matches?
        query = f"""
                SELECT  count(*)
                FROM    users
                WHERE   recovery = {recovery};
                """
        c.execute(query)
        count = c.fetchone()
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

        email = request.args.get('email')
        new_password = request.args.get('new_password')
        
        conn = psycopg2.connect(config())
        c = conn.cursor()

        # change the password and reset code
        query = f"""
                UPDATE  users
                SET     password = {new_password}, recovery = null
                WHERE   email = {email}
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

@api.route('/clickdown/login', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully logged in')
    @api.response(400, 'Bad request')
    @api.doc(description="Enter email and password")
    @api.expect(login_payload)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)

        email = request.args.get('email')
        password = request.args.get('password')

        conn = psycopg2.connect(config())
        c = conn.cursor()
        
        # retrieve id using email and password
        query = f"""
                SELECT  id
                FROM    users
                WHERE   email = {email} and password = {password};
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

@api.route('/clickdown/logout', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully logged out')
    @api.response(400, 'Bad request')
    @api.doc(description="Automatically logs out")
    @api.expect(login_payload)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)

        id = request.args.get('id')

        conn = psycopg2.connect(config())
        c = conn.cursor()
        
        # HOW TO IMPLEMENT LOGOUT???
        # store JWT in db maybe?

        return {'value': True}

if __name__ == '__main__':
    # conn = psycopg2.connect(config())
    # c = conn.cursor()
    # # create table users
    # query = """
    #         CREATE TABLE IF NOT EXISTS users (
    #             id              serial      primary key,
    #             username        varchar(32) unique not null,
    #             password        text        not null,
    #             email           text        unique not null,
    #             first_name      text        not null,
    #             last_name       text        not null,
    #             phone_number    text        not null,
    #             company         text        ,
    #             recovery        int
    #         );
    #         """
    # c.execute(query)

    # # CAN DELETE IF enum is enforced by frontend, if so, change state to text
    # # create state type first
    # query = """
    #         CREATE TYPE state AS ENUM (
    #             "not started", "in progress", "blocked", "completed"
    #         );
    #         """
    # c.execute(query)
    # # create table tasks
    # query = """
    #         CREATE TABLE IF NOT EXISTS tasks (
    #             id              serial      primary key,
    #             owner           int         foreign key references users(id),
    #             title           varchar(20) not null,
    #             description     text        not null,
    #             creation_date   timestamp   not null,
    #             deadline        timestamp   ,
    #             labels          text        ,
    #             current_state   state       not null,
    #             progress        int         
    #         );
    #         """
    # c.execute(query)
    
    # c.close()
    # conn.close()

    app.run(debug=True)