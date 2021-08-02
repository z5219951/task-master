import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

bp = Blueprint('friends', __name__, url_prefix='/friends')
api = Namespace("friends", "Operations for adding/removing friends")

@api.route('/<email>/requests', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Got request/s')
    @api.response(400, 'Bad request')    
    @api.doc(description="Search for pending friend requests")
    def get(self, email):
        requests_list = []
    
        userInfo = getUserByEmail(email)
        
        if userInfo == {}:
            return requests_list
                
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        query = f"""
            SELECT  user_from
            FROM    friend_requests
            WHERE   user_to = ?
            """
        
        c.execute(query, [f'{userInfo["id"]}'])
        friendRequests = c.fetchall()
        
        for id in friendRequests:
            userInfo = getUserByID(id[0])
            userJson = {
                "requestUser": userInfo["id"],
                "userName"   : userInfo["first_name"] + " " +
                               userInfo["last_name"]
            }
            requests_list.append(userJson)
        
        return requests_list, 200

request_payload = api.model('request connection', {
    "userId": fields.Integer,
    "requestedUser": fields.Integer
})

@api.route('/sendRequest', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Request sucessfully sent and actioned in database')
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
        
        res = friendRequestAdd(user_from, user_to)
        
        if res == False:
            return {'value': False}, 200
        
        return {'value': True},200
        
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
        res1 = friendRequestRemove(user_from, user_to)
        res2 = friendRequestRemove(user_to, user_from)
        
        if (res1 or res2):
            return {'value': True},200
        
        return {'value': False},200


@api.route('/accept', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Accept command OK')
    @api.response(400, 'Bad request - Friend request is not valid')
    @api.doc(description="Link two account IDs as friends")
    @api.expect(request_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('requestedUser', required=True)
        args = parser.parse_args()
        
        user_from = args.requestedUser
        user_to = args.userId
        
        res = friendRequestRemove(user_from, user_to)
        
        # Check if request is valid and within database
        if res == False:            
            return {'value': False}
        else:
            friendListAdd(user_from, user_to)
        
        return {'value': True}, 200


@api.route('/lists/<int:userId>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Sucessfully searched for connected users')
    @api.response(400, 'Bad request')
    @api.doc(description= "Returns all users that is connected to the given user")
    def get(self, userId):
        return json.dumps(friendListGet(userId)), 200
        
# HELPER FUNCTIONS
def getUserByID(id):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    query = f"""
            SELECT  id, username, email, first_name, last_name, phone_number, company
            FROM    users
            WHERE   id = ?;
            """

    c.execute(query, [f'{id}'])
    data = c.fetchone()
    c.close()
    conn.close()
    
    userDict = {}
    if data != None:
        userDict = {
            "id" :          data[0],
            "username":     data[1],
            "email":        data[2],
            "first_name":   data[3],
            "last_name":    data[4],
            "phone_number": data[5],
            "company":      data[6]
        }
    
    return userDict

def getUserByEmail(email):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            SELECT  id
            FROM    users
            WHERE   email = ?;
            """

    c.execute(query, [f'{email}'])
    data = c.fetchone()
    conn.close()

    return getUserByID(data[0])

# Add an entry into the "friend_request" table to keep track of pending requests
def friendRequestAdd(user_from, user_to):
    if user_from == user_to:
        return False
        
    # Check that users exist
    user = getUserByID(user_from)
    if user == {}:
        return False
    
    user = getUserByID(user_to)
    if user == {}:
        return False
    
    # Check that users are not already connected
    friends = friendListGet(user_to)
    
    for f in friends:
        if str(f["requestedUser"]) == (user_from):
            return False
    
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            INSERT INTO friend_requests (user_from, user_to)
            VALUES (?, ?);
            """

    try: 
        c.execute(query, (f'{user_from}', f'{user_to}'))
        
    # If a request exists already
    except sqlite3.IntegrityError:
        return True

    conn.commit()
    conn.close()
    
    return True

# Delete from Table "friend_requests" given two user IDs
# Returns True if action is correctly executed, False if record cannot be found
def friendRequestRemove(user_from, user_to):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
        SELECT  *
        FROM    friend_requests
        WHERE   user_to = ?
        AND     user_from = ?;
        """
    
    c.execute(query, (f'{user_to}', f'{user_from}'))
    data = c.fetchone()
    
    if data is None:
        return False
    
    else:
        query = f"""
                DELETE
                FROM    friend_requests
                WHERE   user_to = ?
                AND     user_from = ?;
                """
        c.execute(query, (f'{user_to}', f'{user_from}'))
        conn.commit()
    
    return True

# Create "friend_list" entry
def friendListAdd(userA, userB):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            INSERT INTO friend_list (user_a, user_b)
            VALUES (?, ?);
            """
    c.execute(query, (f'{userA}', f'{userB}'))
    conn.commit()

# Return a list of users connected to the given userId
# Format is a dictionary {requestedUser: , name:, email: }
def friendListGet(userId):        
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    # Find all entries that "user a" is friends with "user b", vice versa
    query = f"""
            CREATE TEMP TABLE friends
            AS SELECT user_a
            FROM friend_list
            WHERE user_b = ?
            UNION
            SELECT user_b
            FROM friend_list
            WHERE user_a = ?;
            """
    c.execute(query, (f'{userId}', f'{userId}'))
    
    # For above user Ids, get the corresponding entries within the users table
    query = f"""
            SELECT id, first_name, last_name, email
            FROM users
            INNER JOIN friends ON users.id = friends.user_a;
            """
    c.execute(query)
    
    data = c.fetchall()    
    conn.close()
    
    res = []
    for d in data:
        res.append({"requestedUser" : d[0],
                    "name" : d[1] + " " + d[2],
                    "email": d[3]})
                    
    return res