import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

bp = Blueprint('friends', __name__, url_prefix='/friends')
api = Namespace("friends", "Operations for adding/removing friends")

### HELPERS ###
# Return public user data in a dictionary,  given an email
def get_user_from_email(email):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  *
            FROM    users
            WHERE   email = '{email}';
            """
    c.execute(query)
    data = c.fetchone()
    
    user = {}

    if (data is not None):
        user = {
            "id" : f'{data[0]}',
            "email" : f'{data[3]}',
            "first_name" : f'{data[4]}',
            "last_name" : f'{data[5]}',
            "phone" : f'{data[6]}',
            "company" : f'{data[7]}',
        }
        
    return user
    
# Return public user data in a dictionary,  given a user ID
def get_user_from_id(id):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  *
            FROM    users
            WHERE   id = '{id}';
            """
    c.execute(query)
    data = c.fetchone()
    
    user = {}

    if (data is not None):
        user = {
            "id" : f'{data[0]}',
            "email" : f'{data[3]}',
            "first_name" : f'{data[4]}',
            "last_name" : f'{data[5]}',
            "phone" : f'{data[6]}',
            "company" : f'{data[7]}',
        }
        
    return user

# Delete from Table "friend_requests" given two user IDs
# Returns True if action is correctly executed, False if record cannot be found
def friend_list_remove(user_from, user_to):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
        SELECT  *
        FROM    friend_requests
        WHERE   user_to = '{user_to}'
        AND     user_from = '{user_from}';
        """
    
    c.execute(query)
    data = c.fetchone()
    
    if data is None:
        return False
    
    else:
        query = f"""
                DELETE
                FROM    friend_requests
                WHERE   user_to = '{user_to}'
                AND     user_from = '{user_from}';
                """
        c.execute(query)
        conn.commit()
    
    return True


### FRIEND ROUTES ### 
request_payload = api.model('request connection', {
    "userId": fields.Integer,
    "requestedUser": fields.Integer
})

@api.route('/sendRequest', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Request Sent')
    @api.response(400, 'Bad request - User/s does not exist')
    @api.doc(description="Send a friend request to requested user")
    @api.expect(request_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('requestedUser', required=True)
        args = parser.parse_args()
        
        user_from = args.userId
        user_to = args.requestedUser
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        query = f"""
                INSERT INTO friend_requests (user_from, user_to)
                VALUES ('{user_from}', '{user_to}');
                """
        
        try: 
            c.execute(query)
        
        # If the request had been sent already
        except sqlite3.IntegrityError:
            return {'value': True},200
        
        conn.commit()
        
        return {'value': True},200

@api.route('/<email>/requests', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Sucessfully searched for requests')
    @api.response(400, 'Bad request')    
    @api.doc(description="Search for pending friend requests")
    def get(self, email):
        userInfo = get_user_from_email(email)
        
        if userInfo == {}:
            return [], 400
         
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        query = f"""
            SELECT  user_from
            FROM    friend_requests
            WHERE   user_to = '{userInfo["id"]}'
            """
        
        c.execute(query)
        data = c.fetchall()
        
        requests_list = []
        for id in data:
            userInfo = get_user_from_id(id[0])
            userJson = {
                "requestUser": userInfo["id"],
                "userName"   : userInfo["first_name"] + " " +
                               userInfo["last_name"]
            }
            requests_list.append(userJson)
        
        return requests_list, 200

@api.route('/decline', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Decline command OK')
    @api.response(400, 'Bad request')
    @api.doc(description="Remove friend request from database")
    @api.expect(request_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('requestedUser', required=True)
        args = parser.parse_args()
        
        user_from = args.requestedUser
        user_to = args.userId
        
        # Boolean return values on whether operation was sucessful
        res1 = friend_list_remove(user_from, user_to)
        res2 = friend_list_remove(user_to, user_from)
        
        if (res1 or res2):
            return {'value': True},200
        
        return {'value': False},200


@api.route('/accept', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Accept command OK')
    @api.response(400, 'Bad request - Friend request does not exist')
    @api.doc(description="Link two account IDs as friends")
    @api.expect(request_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('requestedUser', required=True)
        args = parser.parse_args()
        
        user_from = args.requestedUser
        user_to = args.userId
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        res = friend_list_remove(user_from, user_to)
        
        if res == False:            
            return {'value': False},400
        
        else:
            query = f"""
                INSERT INTO friend_list (user_a, user_b)
                VALUES ('{user_to}', '{user_from}');
                """
            c.execute(query)
            conn.commit()
        
        return {'value': True},200


#TODO
@api.route('/searchUser', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Sucessfully searched for requests')
    @api.response(400, 'Bad request')
    @api.doc(description="Search for pending friend requests")
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True)
        
        return False