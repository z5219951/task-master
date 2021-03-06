# standard library imports
from chatbot import *
from chatbotHelpers import *
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
import revisions

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
app.register_blueprint(revisions.bp)
api.add_namespace(revisions.api)

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
    @api.doc(description="Register a new account. Returns json dict {value},\
    value is true on success false otherwise")
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

        # if email is already registered, return false
        if (email_exists(args.email)):
            return {'message': f'A user with that email already exists',
                    'value': False}, 200
        if (user_exists(args.username)):
            return {'message': f'A user with that username already exists',
                    'value': False}, 200

        # input validated, so able to insert into users table
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                INSERT INTO users (username, password, email, first_name, last_name, phone_number, company)
                VALUES (?, ?, ?, ?, ?, ?, ?);
                """
                
        queryParams = (
            f'{args.username}',
            f'{args.password}',
            f'{args.email}',
            f'{args.first_name}',
            f'{args.last_name}',
            f'{args.phone_number}',
            f'{args.company}'
        )
        
        c.execute(query, queryParams)

        conn.commit()
        c.close()
        conn.close()

        return {'value': True}

# Forgot password
forgot_payload = api.model('forgot password', {
    "email": fields.String
})

@api.route('/forgot_password', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully found user, recovery email sent')
    @api.response(400, 'Bad request')
    @api.doc(description="Forgot password. Returns json dict {value}, true if \
    code has been sucessfully sent")
    @api.expect(forgot_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        args = parser.parse_args()

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
                WHERE   recovery = ?;
                """
            c.execute(query, [f'{recovery}'])
            count = c.fetchone()[0]

            if (count == 0):
                break
        
        # update in database
        query = f"""
                UPDATE  users
                SET     recovery = ?
                WHERE   email = ?;
                """
        c.execute(query, (f'{recovery}', f'{email}'))

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
    @api.doc(description="Enter recovery code. Returns json dict {value}, true if code matches")
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
                WHERE   recovery = ?;
                """
        c.execute(query, [f'{args.recovery}'])
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
    @api.doc(description="Enter new password, return dict {value} true if updated in database")
    @api.expect(new_pass_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('new_password', required=True)
        args = parser.parse_args()

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # change the password and reset code
        query = f"""
                UPDATE  users
                SET     password = ?, recovery = null
                WHERE   email = ?;
                """
        c.execute(query, (f'{args.new_password}', f'{args.email}'))

        conn.commit()
        c.close()
        conn.close()

        return {'value': True}


# login
login_payload = api.model('login info', {
    "email": fields.String,
    "password": fields.String
})

@api.route('/login', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully logged in')
    @api.response(400, 'Bad request')
    @api.doc(description="Enter email and password. Return json dict {id}, \
    where id is the userId if successful, empty otherwise")
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
                WHERE   email = ? and password = ?;
                """
        c.execute(query, (f'{args.email}', f'{args.password}'))
        id = c.fetchone()

        c.close()
        conn.close()

        if (id is None):
            return json.dumps({'id':''}), 200

        data = {    
            'id': id[0],
        }
        return json.dumps(data),200

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

        return {'value': True}

@api.route('/uploads/<path:path>', methods=['GET'])
class Uploads(Resource):
    @api.response(200, 'Successfully retrieved file')
    @api.response(400, 'Bad request')
    @api.doc(description="Gets a file from the backend directory given a path")
    def get(self,path):
        return send_from_directory(PurePath(app.config['UPLOADS']), path, as_attachment=False)

#webhook receiver route
@api.route('/webhook', methods=['POST'])
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
        dfResponse = sendMessage(req["message"])
        email = req["user"]["email"]
        initMsg = req["message"]
        intent = dfResponse.query_result.intent.display_name
        reply = parseIntent(intent, dfResponse, email, initMsg)
        cRes = reply['fulfillment_text']
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        timestamp = datetime.now()
        query = f"""
                INSERT INTO messages (usr_msg_time, email, chat_response, user_msg)
                VALUES (?, ?, ?, ?);
                """
        c.execute(query, (f'{timestamp}', f'{email}', f'{cRes}', f'{initMsg}'))

        conn.commit()
        c.close()
        conn.close()

        return reply

@api.route('/reminder', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully sent emails')
    @api.response(400, 'Bad Request')
    @api.doc(description="Checks the database to see if task reminders need to be sent")
    def get(self):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  t.id, t.deadline, t.title, u.email
                FROM    tasks t
                JOIN    users u ON u.id = t.owner
                WHERE   reminded = 0;
                """
        c.execute(query)

        data = c.fetchone()
        task_list = {}

        while data is not None:
            task_list[data[0]] = [data[1], data[2], data[3]]
            data = c.fetchone()

        if task_list == {}:
            return

        for id in task_list:
            title = task_list[id][1]
            email = task_list[id][2]
            deadline = datetime.strptime(task_list[id][0], '%Y-%m-%d').date()
            today = date.today()
            delta = today - deadline

            if delta < timedelta(days=3):
                with app.app_context():
                    msg = Message(subject="You have a task deadline soon!",
                                sender='clickdown3900@gmail.com',
                                recipients=[f"{email}"], 
                                body=f"Your task '{title}' is due soon. If it is already completed, please mark it 'Complete' on ClickDown.")
                    mail.send(msg)
                query = f"""
                        UPDATE  tasks
                        SET     reminded = 1
                        WHERE   id = {id};
                        """
                c.execute(query)
                conn.commit()

        c.close()
        conn.close()

#calculates and sends back an updated estimate for a given task
#based on the assignee's historical prediction accuracy

update_estimate = api.model('update estimate', {
    "owner": fields.String,
    "time_estimate": fields.Integer,
    "assigned_to": fields.String
})
@api.route('/estimate', methods=['GET'])
class Chatbot(Resource):
    @api.doc(description="Calculates and sends back an updated estimate.")
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('owner', required=True)
        parser.add_argument('time_estimate', required=True)
        parser.add_argument('assigned_to')
        args = parser.parse_args()
        assigned = args.assigned_to
        owner = int(args.owner)
        estimate = int(args.time_estimate)
        if(assigned == ''):
            assigned = owner
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        # get time estimates for this owner
        query = f"""
                SELECT  time_estimate, time_taken
                FROM tasks
                WHERE owner = ?
                AND current_state = 'Completed'
                """
        c.execute(query, [f'{args.owner}'])
        compList = c.fetchall()

        conn.commit()
        c.close()
        conn.close()    
        #Loop through query results and calculate an estimate factor
        #Loop through query results and calculate an estimate factor
        error = 0
        if(len(compList) > 0):
            for i in compList:
                est = i[0]
                taken = i[1]
                error += taken/est
            adjustmentFactor = error / len(compList)
        else:
            adjustmentFactor = 1
        adjEstimate = estimate * adjustmentFactor
        return adjEstimate

#Calculates user busyness

@api.route('/busy/<string:email>', methods=['GET'])
class Busyness(Resource):
    @api.response(200, 'Successfully retrieved user busyness')
    @api.response(400, 'Bad Request')
    @api.doc(description="Calculates and returns how busy a user is for the next 7 days. Returns an integer \
    for the percentage of busyness")
    def get(self,email):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        owner = getOwner(email)

        query = f"""
                SELECT  time_estimate, deadline
                FROM    tasks
                WHERE   assigned_to = ?
                AND current_state != 'Completed'
                """
        
        c.execute(query, [f'{owner}'])
        timeList = c.fetchall()
        c.close()
        conn.close()
        today = datetime.now()
        busyTotal = 0
        for i in timeList:
            if (i[1] != 'None'):
                deadline = i[1]
                deadline = datetime.strptime(deadline, '%Y-%m-%d')
                #for the sake of avoiding fenceposting, opted to return 8 days including current
                if(deadline >= today - timedelta(1) and deadline <= today + timedelta(7)):
                    busyTotal += i[0]

        return (busyTotal/40)*100



        


if __name__ == '__main__':
    app.run(debug=True)