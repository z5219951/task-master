# standard library imports
from chatbot import *
import json
import random
import sys
from pathlib import PurePath, Path
import os

# third-party imports
from flask import Flask, request, jsonify, Blueprint
from flask.helpers import send_from_directory
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_restx import Resource, Api, fields, inputs, reqparse
import sqlite3

# local imports
# from config import config
from db import *
import friends
from sendMsg import *
import groups
import tasks
import user
import labels
import projects
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
app.register_blueprint(labels.bp)
api.add_namespace(labels.api)
app.register_blueprint(projects.bp)
api.add_namespace(projects.api)

app.config["UPLOADS"] = PurePath(Path(__file__).parent.resolve())

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

cors = CORS(app)

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
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                INSERT INTO users (username, password, email, first_name, last_name, phone_number, company)
                VALUES ('{args.username}', '{args.password}', '{args.email}', '{args.first_name}', '{args.last_name}', '{args.phone_number}', '{args.company}');
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
        
        recovery = -1

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # generate recovery code
        while True:
            recovery = ''.join([str(random.randint(0, 999)).zfill(3) for _ in range(2)])
            
            # is there a recovery code that matches?
            query = f"""
                SELECT  count(*)
                FROM    users
                WHERE   recovery = '{args.recovery}';
                """
            c.execute(query)
            count = c.fetchone()[0]

            if (count == 0):
                break
        
        # update in database
        query = f"""
                UPDATE  users
                SET     recovery = '{recovery}'
                WHERE   email = '{email}';
                """
        c.execute(query)

        conn.commit()
        c.close()
        conn.close()

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

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # is there a recovery code that matches?
        query = f"""
                SELECT  count(*)
                FROM    users
                WHERE   recovery = '{args.recovery}';
                """
        c.execute(query)
        count = c.fetchone()[0]

        c.close()
        conn.close()

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

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # change the password and reset code
        query = f"""
                UPDATE  users
                SET     password = '{args.new_password}', recovery = null
                WHERE   email = '{args.email}';
                """
        c.execute(query)

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
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # retrieve id using email and password
        query = f"""
                SELECT  id
                FROM    users
                WHERE   email = '{args.email}' and password = '{args.password}';
                """
        c.execute(query)
        id = c.fetchone()
        # print(id)

        c.close()
        conn.close()

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
        
        c.close()
        conn.close()

        return {'value': True}

@api.route('/uploads/<path:path>', methods=['GET'])
class Uploads(Resource):
    @api.response(200, 'Successfully retrieved file')
    @api.response(400, 'Bad request')
    @api.doc(description="Gets a file from the backend directory given a path")
    def get(self,path):
        print(f'path obtained is: {path}')
        return send_from_directory(PurePath(app.config['UPLOADS']), path, as_attachment=False)

@api.route('/webhook', methods=['POST'])
#largely deprecated, now exists to support current pipeline.
class Webhook(Resource):
    @api.doc(description="Receives responses via webhook - also supplies dialogflow with fulfilment messages")
    def post(self):
        response = {'fulfillment_text': "This is junk text!"}
        return response,201

@api.route('/chatbot', methods=['POST'])
class Chatbot(Resource):
    @api.doc(description="Handles front end passing messages to /chatbot to be sent to dialogflow")
    def post(self):
        req = json.loads(request.data)
        #sends the req message to dialogflow
        dfResponse = sendMessage(req["message"])
        #dialogflow response
        email = req["user"]["email"]
        initMsg = req["message"]
        #print(response)
        intent = dfResponse.query_result.intent.display_name
        reply = parseIntent(intent, dfResponse, email, initMsg)
        # conn = sqlite3.connect('clickdown.db')
        # c = conn.cursor()

        # query = f"""
        #         INSERT INTO messages (usr_msg_time, email, chat_response, user_msg)
        #         VALUES ('datetime('now')', '{email}', '{reply[0]}', '{initMsg}');
        #         """
        # c.execute(query)

        # conn.commit()
        # c.close()
        # conn.close()
        print(reply)
        return reply






if __name__ == '__main__':
    app.run(debug=True)