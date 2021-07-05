import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

import db

bp = Blueprint('friends', __name__, url_prefix='/friends')
api = Namespace("friends", "Operations for adding/removing friends")

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
        print("Entered")
        res = db.friendRequestAdd(user_from, user_to)
        
        return {'value': res},200

@api.route('/<email>/requests', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Got request/s')
    @api.response(400, 'Bad request')    
    @api.doc(description="Search for pending friend requests")
    def get(self, email):
        res = db.friendRequestGet(email)
        
        return res, 200
        
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
        res1 = db.friendRequestRemove(user_from, user_to)
        res2 = db.friendRequestRemove(user_to, user_from)
        
        if (res1 or res2):
            return {'value': True},200
        
        return {'value': False},200


@api.route('/accept', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Accept command OK')
    @api.response(400, 'Bad request - Friend request does is not valid')
    @api.doc(description="Link two account IDs as friends")
    @api.expect(request_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('requestedUser', required=True)
        args = parser.parse_args()
        
        user_from = args.requestedUser
        user_to = args.userId
        
        res = db.friendRequestRemove(user_from, user_to)
        
        # The request does not exist in database
        if res == False:            
            return {'value': False},400
        else:
            db.friendListAdd(user_from, user_to)
        
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