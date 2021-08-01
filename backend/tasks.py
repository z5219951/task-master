import ast
import json
import os
from pathlib import PurePath, Path
from werkzeug.utils import secure_filename

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

import revisions
import friends
import labels

bp = Blueprint('tasks', __name__, url_prefix='/tasks')
api = Namespace("tasks", "Operations for tasks")

# create task
#Priority and difficulty/indicative load?
task_payload = api.model('task', {
    "owner": fields.Integer,
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "deadline": fields.String,
    "labels": fields.String,
    "current_state": fields.String,
    "time_estimate": fields.Integer,
    "assigned_to": fields.String,
    "time_taken": fields.String
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
        parser.add_argument('assigned_to', required=False)
        parser.add_argument('time_taken', required=False)
        args = parser.parse_args()
        
        query = f"""        
                INSERT INTO tasks (owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, time_taken, reminded)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
                """
        
        queryParams = (
            f'{args.owner}',
            f'{args.title}',
            f'{args.description}',
            f'{args.creation_date}',
            f'{args.deadline}',
            f'{args.labels}',
            f'{args.current_state}',
            f'{args.time_estimate}',
            f'{args.assigned_to}',
            f'{args.time_taken}'
        )
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        c.execute(query, queryParams)

        query = f"""
                SELECT  id
                FROM    tasks
                WHERE   owner = ?
                AND     title = ?
                AND     description = ?
                AND     creation_date = ? ;
                """
        
        c.execute(query, (f'{args.owner}', f'{args.title}', f'{args.description}', f'{args.creation_date}'))
        id = c.fetchone()[0]

        conn.commit()
        c.close()
        conn.close()
        
        # Create an entry in the task edit history
        revisions.revisionsAppend(id, args.owner)

        return {'id': id},200


# get task info given its id
@api.route('/<int:id>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully retrieved task info')
    @api.response(404, 'Not Found')
    @api.doc(description="Gets all tasks for a user given their id")
    def get(self, id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, file_paths, time_taken
                FROM    tasks
                WHERE   id = ?;
                """
    
        c.execute(query, [f'{id}'])
        data = c.fetchone()
        task_info = {}
        if (data is not None):
            task_info = {
                'id': f'{data[0]}',
                'owner': f'{data[1]}',
                'title': f'{data[2]}',
                'description': f'{data[3]}',
                'creation_date': f'{data[4]}',
                'deadline': f'{data[5]}',
                'labels': f'{data[6]}',
                'current_state': f'{data[7]}',
                'time_estimate': f'{data[8]}',
                'assigned_to': f'{data[9]}',
                'file_paths': f'{data[10]}',
                'time_taken': f'{data[11]}'
            }

        c.close()
        conn.close()

        return json.dumps(task_info)


# get all tasks for a user
@api.route('/created/<int:owner>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully retrieved task info')
    @api.response(404, 'Not Found')
    @api.doc(description="Gets all tasks for a user given their id")
    def get(self, owner):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, file_paths, time_taken
                FROM    tasks
                WHERE   owner = ?
                ORDER BY    deadline;
                """

        c.execute(query, [f'{owner}'])
        data = c.fetchone()
        task_list = []

        while (data is not None):
            task_info = {
                'id': f'{data[0]}',
                'owner': f'{data[1]}',
                'title': f'{data[2]}',
                'description': f'{data[3]}',
                'creation_date': f'{data[4]}',
                'deadline': f'{data[5]}',
                'labels': f'{data[6]}',
                'current_state': f'{data[7]}',
                'time_estimate': f'{data[8]}',
                'assigned_to': f'{data[9]}',
                'file_paths': f'{data[10]}',
                'time_taken': f'{data[11]}'
            }
            task_list.append(task_info)
            data = c.fetchone()

        c.close()
        conn.close()

        return json.dumps(task_list)


# get all tasks assigned to a user
@api.route('/assigned/<int:owner>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully retrieved task info')
    @api.response(404, 'Not Found')
    @api.doc(description="Gets all tasks assigned to a user")
    def get(self, owner):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, file_paths, time_taken
                FROM    tasks
                WHERE   assigned_to = ?
                ORDER BY    deadline;
                """

        c.execute(query, [f'{owner}'])
        data = c.fetchone()
        task_list = []

        while (data is not None):
            task_info = {
                'id': f'{data[0]}',
                'owner': f'{data[1]}',
                'title': f'{data[2]}',
                'description': f'{data[3]}',
                'creation_date': f'{data[4]}',
                'deadline': f'{data[5]}',
                'labels': f'{data[6]}',
                'current_state': f'{data[7]}',
                'time_estimate': f'{data[8]}',
                'assigned_to': f'{data[9]}',
                'file_paths': f'{data[10]}',
                'time_taken': f'{data[11]}'
            }
            task_list.append(task_info)
            data = c.fetchone()

        c.close()
        conn.close()

        return json.dumps(task_list)


# update task info
update_payload = api.model('update task info', {
    "id": fields.String,
    "userId": fields.String,
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "deadline": fields.String,
    "labels": fields.String,
    "current_state": fields.String,
    "time_estimate": fields.Integer,
    "assigned_to": fields.String,
    "time_taken": fields.Integer
})

@api.route('/update', methods=['PUT'])
class Users(Resource):
    @api.response(200, 'Successfully updated task')
    @api.response(404, 'Not Found')
    @api.doc(description="Updates a task given its id")
    @api.expect(update_payload)
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('userId', required=True)
        parser.add_argument('title')
        parser.add_argument('description')
        parser.add_argument('creation_date')
        parser.add_argument('deadline')
        parser.add_argument('labels')
        parser.add_argument('current_state')
        parser.add_argument('time_estimate')
        parser.add_argument('assigned_to')
        parser.add_argument('time_taken')
        args = parser.parse_args()

        query = f"""
                UPDATE  tasks
                SET     title = ?,
                        description = ?,
                        creation_date = ?,
                        deadline = ?,
                        labels = ?,
                        current_state = ?,
                        time_estimate = ?,
                        assigned_to = ?,
                        time_taken = ?
                WHERE   id = ?;
                """
        queryParams = (
            f'{args.title}', 
            f'{args.description}', 
            f'{args.creation_date}', 
            f'{args.deadline}',
            f'{args.labels}',
            f'{args.current_state}',
            f'{args.time_estimate}', 
            f'{args.assigned_to}',
            f'{args.time_taken}',
            f'{args.id}'
        )
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        try:
            c.execute(query, queryParams)
 
        except Exception as e:
            c.close()
            conn.close()
            return {'value': False}

        conn.commit()
        c.close()
        conn.close()
        
        revisions.revisionsAppend(args.id, args.userId)

        return {'value': True}

task_search_payload = api.model('task search', {
    "searchTerm": fields.String,
    "currentUser": fields.Integer
})

@api.route('/search', methods=['POST'])
class Tasks(Resource):
    @api.response(200, 'Sucessfully searched for tasks')
    @api.response(400, 'Unexpected error')
    @api.expect(task_search_payload)
    @api.doc(description="Search for tasks related to given user based on \
    id, name, label, description and/or deadline")
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('searchTerm')
        parser.add_argument('currentUser', required=True)
        args = parser.parse_args()
        
        needle = args.searchTerm.lower()
        userId = args.currentUser
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        # Get tasks which the given user is an owner/ assignee
        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to
                FROM    tasks
                WHERE   owner = ?
                OR      assigned_to = ?
                """
        
        # Get tasks assigned to the friends of the given user
        friendsDict = friends.friendListGet(userId)
        for f in friendsDict:
            query = query + (f"OR      assigned_to = '{f['requestedUser']}'\n")
        
        # Sort tasks by earliest deadlines
        query = query + (f"ORDER BY    deadline ASC;\n")
        
        c.execute(query, (f'{userId}', f'{userId}'))
        data_list = c.fetchall()
        
        conn.close()
        
        full_task_list = []
        for data in data_list:
            task_info = {
                'id': f'{data[0]}',
                'owner': f'{data[1]}',
                'title': f'{data[2]}',
                'description': f'{data[3]}',
                'creation_date': f'{data[4]}',
                'deadline': f'{data[5]}',
                'labels': f'{data[6]}',
                'current_state': f'{data[7]}',
                'time_estimate': f'{data[8]}',
                'assigned_to': f'{data[9]}'
            }
            full_task_list.append(task_info)
        
        res_list = []
        for task_info in full_task_list:
            
            # Seach based on id, name, label, desc, deadline
            labelList = labels.rawStrToList(task_info.get("labels"))
            if needle in labelList:
                res_list.append(task_info)
                continue
                
            if ((task_info.get("id") == needle) or \
                (needle == task_info.get("deadline")) or \
                (needle in task_info.get("title").lower()) or \
                (needle in task_info.get("description").lower())):
                res_list.append(task_info)

        return json.dumps(res_list), 200


# upload to a task
@api.route('/upload/<int:task_id>', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully attached file to a task')
    @api.response(400, 'Bad Request')
    @api.doc(description="Receives a file and stores it in the backend")
    def post(self, task_id):
        files = request.files.getlist('file')
        url_list = []

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        for file in files:
            filename = secure_filename(file.filename)

            if filename != '':
                dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tasks', str(task_id))
                os.makedirs(dir, exist_ok=True)
                path = os.path.join(dir, filename)
                file.save(path)

                url = 'http://localhost:5000/uploads/tasks/' + str(task_id) + '/' + filename 
                url_list.append(url)
        
        query = f"""
                SELECT  file_paths
                FROM    tasks
                WHERE   id = ?;
                """
        c.execute(query, [f'{task_id}'])

        existing = c.fetchone()

        try:
            url_list = ast.literal_eval(existing[0]) + url_list
        except:
            pass

        query = f'''
                UPDATE  tasks
                SET     file_paths = ?
                WHERE   id = ?;
                '''
        c.execute(query, (f'{url_list}', f'{task_id}'))
        
        conn.commit()
        c.close()
        conn.close()

        return json.dumps(url_list)

# Helper Functions
# Return a dictionary representation of a task in the database
def getTaskbyId(taskId):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, file_paths
            FROM    tasks
            WHERE   id = ?
            """
    c.execute(query, [f'{taskId}'])
    data = c.fetchone()
    
    if data is None:
        conn.close()
        return {}
    
    task = {
        'owner': f'{data[0]}',
        'title': f'{data[1]}',
        'description': f'{data[2]}',
        'creation_date': f'{data[3]}',
        'deadline': f'{data[4]}',
        'labels': f'{data[5]}',
        'current_state': f'{data[6]}',
        'time_estimate': f'{data[7]}',
        'assigned_to': f'{data[8]}',
        'file_paths': f'{data[9]}'
    }
    
    return task
