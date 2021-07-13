import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

import db

bp = Blueprint('tasks', __name__, url_prefix='/tasks')
api = Namespace("tasks", "Operations for tasks")

task_search_payload = api.model('search', {
    "searchTerm": fields.String,
    "currentUser": fields.Integer
})
@api.route('/searchTasks', methods=['POST'])
class Tasks(Resource):
    @api.response(200, 'Sucessfully searched for tasks')
    @api.response(400, 'Not implemented')
    @api.expect(task_search_payload)
    @api.doc(description="Search for tasks related to given user based on \
    id, name, label, description and/or deadline")
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('searchTerm')
        parser.add_argument('currentUser', required=True)
        args = parser.parse_args()
        
        needle = args.searchTerm
        userId = args.currentUser
        
        full_task_list = db.getTasks(userId)
            
        res_list = []
        for task_info in full_task_list:
            # Seach based on id, name, label, desc, deadline
            if ((task_info.get("id") == needle) or \
                (needle in task_info.get("deadline")) or \
                (needle in task_info.get("title")) or  \
                (needle in task_info.get("description"))):
                res_list.append(task_info)
                
        return json.dumps(res_list), 200
