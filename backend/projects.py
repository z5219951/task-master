import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from db import *

bp = Blueprint('projects', __name__, url_prefix='/projects')
api = Namespace("projects", "Operations for projects")


create_payload = api.model('create group payload', {
    "groupId": fields.Integer,
    "name": fields.String,
    "description": fields.String
})

@api.route('/create', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Project successfully created')
    @api.response(400, 'Bad request')
    @api.doc(description="Create a project with the specified users")
    @api.expect(create_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('groupId', required=True)
        parser.add_argument('name', required=True)
        parser.add_argument('description', required=True)
        args = parser.parse_args()

        group = args.groupId
        name = args.name
        description = args.description

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                INSERT INTO projects (group, name, description)
                VALUES ('{group}', '{name}', '{description}');
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

