import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from db import *

bp = Blueprint('projects', __name__, url_prefix='/projects')
api = Namespace("projects", "Operations for projects")

create_payload = api.model('create project payload', {
    "assigned_to": fields.Integer,
    "name": fields.String,
    "description": fields.String,
    "connected_tasks": fields.List(fields.Integer),
    "created_by": fields.Integer
})

@api.route('/create', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Project successfully created')
    @api.response(400, 'Bad request')
    @api.doc(description="Create a project with the tasks")
    @api.expect(create_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('assigned_to', required=True)
        parser.add_argument('name', required=True)
        parser.add_argument('description', required=True)
        parser.add_argument('connected_tasks', required=False)
        parser.add_argument('created_by', required=True)
        args = parser.parse_args()

        groupid = args.assigned_to
        name = args.name
        description = args.description
        created_by = args.created_by
        task_list = request.get_json()['connected_tasks']

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                INSERT INTO projects (groupid, name, description, tasks)
                VALUES ('{groupid}', '{name}', '{description}', '{json.dumps(task_list)}');
                """
        c.execute(query)
        conn.commit()

        query = f"""
                SELECT  id
                FROM    projects
                WHERE   groupid = '{groupid}'
                AND     name = '{name}'
                AND     description = '{description}'
                AND     task_list = '{json.dumps(task_list)}';
                """
        c.execute(query)
        id = c.fetchone()[0]

        for task in task_list:
            query = f"""
                    UPDATE  tasks
                    SET     project = {id}
                    WHERE   id = {task}
                    """
            c.execute(query)
            conn.commit()

        return {'value': True}


update_payload = api.model('update group payload', {
    "id": fields.Integer,
    "groupid": fields.Integer,
    "name": fields.String,
    "description": fields.String,
    "tasks": fields.List(fields.Integer),
})

@api.route('/update', methods=['PUT'])
class Users(Resource):
    @api.response(200, 'Project successfully updated')
    @api.response(400, 'Bad request')
    @api.doc(description="update a project")
    @api.expect(update_payload)
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('groupid', required=True)
        parser.add_argument('name', required=True)
        parser.add_argument('description', required=False)
        parser.add_argument('tasks', required=True)
        args = parser.parse_args()

        task_list = request.get_json()['tasks']

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE  projects
                SET     groupid = '{args.groupid}',
                        name = '{args.name}',
                        description = '{args.description}',
                        tasks = {json.dumps(task_list)}
                WHERE   id = {args.id};
                """
        c.execute(query)
        conn.commit()

        for task in task_list:
            query = f"""
                    UPDATE  tasks
                    SET     project = {args.id}
                    WHERE   id = {task}
                    """
            c.execute(query)
            conn.commit()

        return {'value': True}


@api.route('/<int:group_id>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Projects successfully retrieved')
    @api.response(400, 'Bad request')
    @api.doc(description="Get all projects for a group given its group id")
    def get(self, group_id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  name, description
                FROM    projects
                WHERE   groupid = '{group_id}'
                ORDER BY    name;
                """

        c.execute(query)
        try:
            data = c.fetchone()
        except:
            return []
            
        project_list = []

        while (data is not None):
            project_info = {
                'name': f'{data[0]}',
                'description': f'{data[1]}'
            }
            project_list.append(project_info)
            data = c.fetchone()

        # print(project_list)

        c.close()
        conn.close()

        return json.dumps(project_list)


@api.route('/tasks/<int:project_id>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Projects successfully retrieved')
    @api.response(400, 'Bad request')
    @api.doc(description="Get all projects for a group given its group id")
    def get(self, group_id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  name, description
                FROM    projects
                WHERE   group = '{group_id}'
                ORDER BY    name;
                """

        c.execute(query)
        try:
            data = c.fetchone()
        except:
            return []
            
        project_list = []

        while (data is not None):
            project_info = {
                'name': f'{data[0]}',
                'description': f'{data[1]}'
            }
            project_list.append(project_info)
            data = c.fetchone()

        # print(project_list)

        c.close()
        conn.close()

        return json.dumps(project_list)

