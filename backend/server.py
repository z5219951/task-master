# standard library imports
import json
import random
import sys

# third-party imports
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_restx import Resource, Api, fields, inputs, reqparse
import sqlite3

# local imports
# from config import config
from db import *
import friends
import groups
import tasks
import user

app = Flask(__name__)
api = Api(app,
          default="ClickDown",  # Default namespace
          title="Capstone Project COMP3900",  # Documentation Title
          description="This page contains all of the HTTP requests that we service.")  # Documentation Description

app.register_blueprint(friends.bp)
api.add_namespace(friends.api)
app.register_blueprint(groups.bp)
api.add_namespace(groups.api)
app.register_blueprint(tasks.bp)
api.add_namespace(tasks.api)
app.register_blueprint(user.bp)
api.add_namespace(user.api)

cors = CORS(app)

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

        # if email is already registered, return false
        # DELETE THIS IF FRONTEND ALREADY CHECKS VALIDITY
        if (email_exists(args.email)):
            return {'message': f'A user with that email already exists',
                    'value': False}, 200
        if (user_exists(args.username)):
            return {'message': f'A user with that username already exists',
                    'value': False}, 200

        # at this point, all inputs should be valid
        # insert values into users table
        insertUser(args.username, args.password, args.email, args.first_name, args.last_name, args.phone_number, args.company)

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
        
        recovery = -1

        # generate recovery code
        while True:
            recovery = ''.join([str(random.randint(0, 999)).zfill(3) for _ in range(2)])
            
            count = recoveryMatch(recovery)

            if (count == 0):
                break

        updateRecovery(email, recovery)

        # send email with code
        with app.app_context():
            msg = Message(subject="Forgot your password?",
                          sender='clickdown3900@gmail.com',
                          recipients=[f"{email}"], 
                          body=f"Recovery code is {recovery}")
            mail.send(msg)

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

        count = recoveryMatch(args.recovery)

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
        #print(args)

        updatePassword(args.email, args.new_password)
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

        id = authCheck(args.email, args.password)
        print(id)
        if (id is None):
            return json.dumps({'id':''}), 200

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
        # store JWT in db maybe? ->
        # //Force JWT to expire from frontend
        
        c.close()
        conn.close()

        return {'value': True}


if __name__ == '__main__':
    # params = config()
    # conn = psycopg2.connect(**params)

    app.run(debug=True)