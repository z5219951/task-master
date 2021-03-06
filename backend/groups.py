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
    @api.doc(description="Create a group with the specified users. Return a \
    json dict {value}, value is true if succesful false otherwise")
    @api.expect(create_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('groupName', required=True)
        parser.add_argument('userList', required=True)
        args = parser.parse_args()

        name = args.groupName
        user_list = request.get_json()['userList']

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  COUNT(DISTINCT name)
                FROM    groups;
                """
        c.execute(query)

        count = -1
        try:
            count = c.fetchone()[0]
        except:
            count = 0

        for user in user_list:
            query = f"""
                    INSERT INTO groups (id, name, user)
                    VALUES (?, ?, ?);
                    """
            c.execute(query, (f'{count}', f'{name}', f'{user}'))

        conn.commit()

        return {'value': True}


@api.route('/<int:user_id>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Group successfully retrieved')
    @api.response(400, 'Bad request')
    @api.doc(description="Get all groups for a user. Return a json list \
    [{groudID, groupName, members}]. Members is a json list {userID, userName,email}")
    def get(self, user_id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, name
                FROM    groups
                WHERE   user = ?
                """
        c.execute(query, [f'{user_id}'])

        group_list = []

        group_name = ''
        group_id = ''
        try:
            data = c.fetchone()
            group_id = data[0]
            group_name = data[1]
        except:
            return json.dumps(group_list)

        while (group_id is not None and group_name is not None):
            id = group_id
            name = group_name
            members = []

            c2 = conn.cursor()
            query = f"""
                    SELECT  users.id, users.first_name, users.last_name, users.email
                    FROM    users
                    JOIN    groups
                    ON      groups.user = users.id
                    WHERE   groups.id = ?
                    """
            c2.execute(query, [f'{id}'])


            user = c2.fetchone()
            while (user is not None):
                user_info = {
                    "userId": user[0],
                    "userName": user[1] + user[2],
                    "email": user[3]
                }
                members.append(user_info)
                user = c2.fetchone()

            group_info = {
                "groupID": id,
                "groupName": name,
                "members": members
            }
            group_list.append(group_info)

            data = c.fetchone()
            if (data == None):
                group_id = None
                group_name = None   
            else:
                group_id = data[0]
                group_name = data[1]

        return json.dumps(group_list)


task_payload = api.model('task group payload', {
    "project": fields.Integer
})
@api.route('/<int:id>/tasks', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Tasks successfully received')
    @api.response(400, 'Bad request')
    @api.doc(description="Get all tasks for all users of a group. Return json list [id]")
    @api.expect(task_payload)
    def get(self, id):
        project = request.args.get('project')
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  *
                FROM    tasks;
                """
        c.execute(query)

        if project is None:
            query = f"""
                    SELECT  tasks.id
                    FROM    groups
                    JOIN    users   ON groups.user = users.id
                    JOIN    tasks   ON tasks.assigned_to = users.id
                    WHERE   (groups.id = ?)
                    AND     (tasks.project is null);
                    """
            c.execute(query, [f'{id}'])

        else:
            query = f"""
                    SELECT  tasks.id
                    FROM    groups
                    JOIN    users   ON groups.user = users.id
                    JOIN    tasks   ON tasks.assigned_to = users.id
                    WHERE   (groups.id = ?)
                    AND     (tasks.project is null OR tasks.project = ?);
                    """
            c.execute(query, (f'{id}', f'{project}'))

        data = c.fetchone()
        task_list = []

        while (data is not None):
            task_id = data[0]

            task_list.append(task_id)

            data = c.fetchone()
        
        return json.dumps(task_list)


@api.route('/<int:id>/projects', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Projects successfully received')
    @api.response(400, 'Bad request')
    @api.doc(description="Get all projects for a group. Return json list [{id, name, description, tasks, groupid}]")
    def get(self, id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, name, description, tasks, groupid
                FROM    projects
                WHERE   groupid = ?;
                """
        c.execute(query, [f'{id}'])
        data = c.fetchone()
        project_list = []

        while (data is not None):
            project_info = {
                'id': f'{data[0]}',
                'name': f'{data[1]}',
                'description': f'{data[2]}',
                'tasks': f'{data[3]}',
                'groupid': f'{data[4]}'
            }
            project_list.append(project_info)
            data = c.fetchone()
            
        c.close()
        conn.close()

        return json.dumps(project_list)