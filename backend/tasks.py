import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from db import *

bp = Blueprint('tasks', __name__, url_prefix='/tasks')
api = Namespace("tasks", "Operations for tasks")


# create task
task_payload = api.model('task', {
    "owner": fields.Integer,
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "deadline": fields.String,
    "current_state": fields.String,
    "time_estimate": fields.Integer,
})

@api.route('/create', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully created task')
    @api.response(400, 'Bad Request')
    @api.doc(description="Creates a task with the given info")
    @api.expect(task_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('owner', required=True)
        parser.add_argument('title', required=True)
        parser.add_argument('description', required=True)
        parser.add_argument('creation_date', required=True)
        parser.add_argument('deadline', required=False)
        parser.add_argument('labels', required=False)
        parser.add_argument('current_state', required=False, default='Not Started')
        parser.add_argument('time_estimate', required=False)
        args = parser.parse_args()
        #print(args)

        id = createTask(args.owner, args.title, args.description, args.creation_date, args.deadline, args.current_state, args.time_estimate, args.labels)

        return {'id': id},200


# update task info
update_payload = api.model('update info', {
    "id": fields.String,
    "owner": fields.String,
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "deadline": fields.String,
    # "labels": fields.String,
    "current_state": fields.String,
    "progress": fields.Integer,
    "time_estimate": fields.Integer,
    "difficulty": fields.String
})

@api.route('/update', methods=['PUT'])
class Users(Resource):
    @api.response(200, 'Successfully updated task')
    @api.response(404, 'Not Found')
    @api.doc(description="Updates a task given its id")
    @api.expect(update_payload)
    def put(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('owner')
        parser.add_argument('title')
        parser.add_argument('description')
        parser.add_argument('creation_date')
        parser.add_argument('deadline')
        # parser.add_argument('labels')
        parser.add_argument('current_state')
        parser.add_argument('progress')
        parser.add_argument('time_estimate')
        parser.add_argument('difficulty')
        args = parser.parse_args()
        # print(args)

        id = args.id
        owner = args.owner
        title = args.title
        description = args.description
        creation_date = args.creation_date
        deadline = args.deadline
        # labels = args.labels
        current_state = args.current_state
        progress = args.progress
        time_estimate = args.time_estimate
        difficulty = args.difficulty

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE  users
                SET     owner = '{owner}',
                        title = '{title}',
                        description = '{description}',
                        creation_date = '{creation_date}',
                        deadline = '{deadline}',
                        current_state = '{current_state}'
                        progress = '{progress}'
                        time_estimate = '{time_estimate}'
                        difficulty = '{difficulty}'
                WHERE   id = '{id}';
                """
        try:
            c.execute(query)
        except:
            c.close()
            conn.close()
            return {'value': False}, 200
        c.close()
        conn.close()

        return {'value': True}