import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from db import *

bp = Blueprint('groups', __name__, url_prefix='/groups')
api = Namespace("groups", "Operations for groups")

create_payload = api.model('create group payload', {
    "userId": fields.Integer,
    "groupName": fields.String,
    "userList": fields.List(fields.Integer)
})

@api.route('/create', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Group successfully created')
    @api.response(400, 'Bad request')
    @api.doc(description="Create a group with the specified users")
    @api.expect(create_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('groupName', required=True)
        parser.add_argument('userList', required=True)
        args = parser.parse_args()
        
        name = args.groupName
        # user_list = args.userList
        user_list = request.get_json()['userList']
        print(f"type of user_list is: {type(user_list)}")
        print(f"list is: {user_list}")

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        for user in user_list:
            query = f"""
                    INSERT INTO groups (name, user)
                    VALUES ('{name}', '{user}');
                    """
            c.execute(query)

        conn.commit()
            
        return {'value': True}

@api.route('/<int:id>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Group successfully retrieved')
    @api.response(400, 'Bad request')
    @api.doc(description="Get all groups for a user")
    def get(self, id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  name
                FROM    groups
                WHERE   user = '{id}'
                """
        c.execute(query)

        group_list = []

        try:
            group_name = c.fetchone()
        except:
            return json.dumps(group_list)
            
        print(f'name fetched is: {group_name}')

        while (group_name is not None):
            name = group_name[0]
            members = []

            c2 = conn.cursor()
            query = f"""
                    SELECT  users.id, users.first_name, users.last_name
                    FROM    users
                    JOIN    groups
                    ON      groups.user = users.id
                    WHERE   groups.name = '{name}'
                    """
            c2.execute(query)

            user = c2.fetchone()
            while (user is not None):
                user_info = {
                    "userId": user[0],
                    "userName": user[1] + user[2]
                }
                members.append(user_info)
                user = c2.fetchone()
            
            group_info = {
                "groupName": name,
                "members": members
            }
            group_list.append(group_info)

            group_name = c.fetchone()
        
        print(f'Completed group list is: {group_list}')
            
        return json.dumps(group_list)
