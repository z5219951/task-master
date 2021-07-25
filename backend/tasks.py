import json
import os
import datetime as dt
from pathlib import PurePath, Path
from werkzeug.utils import secure_filename

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from friends import friendListGet, getUserByID

bp = Blueprint('tasks', __name__, url_prefix='/tasks')
api = Namespace("tasks", "Operations for tasks")

# create task
task_payload = api.model('task', {
    "owner": fields.Integer,
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "deadline": fields.String,
    "labels": fields.String,
    "current_state": fields.String,
    "time_estimate": fields.Integer,
    "assigned_to": fields.String
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
        args = parser.parse_args()
        #print(args)

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                INSERT INTO tasks (owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to)
                VALUES ('{args.owner}', '{args.title}', '{args.description}', '{args.creation_date}', '{args.deadline}', '{args.labels}', '{args.current_state}', '{args.time_estimate}', '{args.assigned_to}');
                """
        c.execute(query)
        print(query)

        query = f"""
                SELECT  id
                FROM    tasks
                WHERE   owner = '{args.owner}'
                AND     title = '{args.title}'
                AND     description = '{args.description}'
                AND     creation_date = '{args.creation_date}';
                """
        c.execute(query)
        id = c.fetchone()[0]

        conn.commit()
        c.close()
        conn.close()
        
        # Create an entry in the task edit history
        revisionsInitialise(id)

        return {'id': id},200


# get all tasks for a user
@api.route('/<int:owner>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully retrieved task info')
    @api.response(404, 'Not Found')
    @api.doc(description="Gets all tasks for a user given their id")
    def get(self, owner):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, file_paths
                FROM    tasks
                WHERE   owner = '{owner}'
                ORDER BY    deadline;
                """

        c.execute(query)
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
                'file_paths': f'{data[10]}'
            }
            task_list.append(task_info)
            data = c.fetchone()

        # print(task_list)

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
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, file_paths
                FROM    tasks
                WHERE   assigned_to = '{owner}'
                ORDER BY    deadline;
                """

        c.execute(query)
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
                'file_paths': f'{data[10]}'
            }
            task_list.append(task_info)
            data = c.fetchone()

        # print(task_list)

        c.close()
        conn.close()

        return json.dumps(task_list)


# update task info
update_payload = api.model('update info', {
    "id": fields.String,
    "owner": fields.String,
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "deadline": fields.String,
    "labels": fields.String,
    "current_state": fields.String,
    "time_estimate": fields.Integer,
    "assigned_to": fields.String
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
        parser.add_argument('owner')
        parser.add_argument('title')
        parser.add_argument('description')
        parser.add_argument('creation_date')
        parser.add_argument('deadline')
        parser.add_argument('labels')
        parser.add_argument('current_state')
        parser.add_argument('time_estimate')
        parser.add_argument('assigned_to')
        args = parser.parse_args()
        # print(args)

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE  tasks
                SET     owner = '{args.owner}',
                        title = '{args.title}',
                        description = '{args.description}',
                        creation_date = '{args.creation_date}',
                        deadline = '{args.deadline}',
                        labels = '{args.labels}',
                        current_state = '{args.current_state}',
                        time_estimate = '{args.time_estimate}',
                        assigned_to = '{args.assigned_to}'
                WHERE   id = '{args.id}';
                """
        try:
            c.execute(query)
        except:
            c.close()
            conn.close()
            return {'value': False}

        conn.commit()
        c.close()
        conn.close()
        
        # TODO Here, assumption that the owner executed the task update
        revisionsAppend(args.id, args.owner)

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
                WHERE   owner = '{userId}'
                OR      assigned_to = '{userId}'
                """
        
        # Get tasks assigned to the friends of the given user
        friendsDict = friendListGet(userId)
        for f in friendsDict:
            query = query + (f"OR      assigned_to = '{f['requestedUser']}'\n")
        
        # Sort tasks by earliest deadlines
        query = query + (f"ORDER BY    deadline ASC;\n")
        
        print(query)
        c.execute(query)
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
        print(full_task_list)
        for task_info in full_task_list:
            # Seach based on id, name, label, desc, deadline
            if ((task_info.get("id") == needle) or \
                (needle in task_info.get("deadline")) or \
                (needle in task_info.get("title").lower()) or \
                (needle in task_info.get("labels").lower()) or \
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
        print(f'upload received task_id is: {task_id}')
        files = request.files.getlist('file')
        url_list = []

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        for file in files:
            print(f'upload received filetype is: {type(file)}')
            filename = secure_filename(file.filename)

            if filename != '':
                dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tasks', str(task_id))
                # dir = PurePath(Path(__file__).parent.resolve(), 'tasks', str(task_id))
                os.makedirs(dir, exist_ok=True)
                path = os.path.join(dir, filename)
                # path = PurePath(dir, filename)
                # path example: 'tasks/123/file.png'
                
                print(f'path type is: {type(path)}')
                print(f'path name is: {path}')
                file.save(path)

                url = 'localhost/uploads/tasks/' + str(task_id) + '/' + filename
                url_list.append(url)

                print(f"appended to list: {url}")

        query = f'''
                UPDATE  tasks
                SET     file_paths = "{url_list}"
                WHERE   id = {task_id};
                '''
        print(query)
        c.execute(query)
        
        conn.commit()
        c.close()
        conn.close()

        return json.dumps(url_list)

@api.route('/revisons/<int:taskId>', methods=['GET'])
class Tasks(Resource):
    @api.response(200, 'Sucessfully returned list of revisions')
    @api.response(400, 'Unexpected error')
    @api.doc(description="Given a taskId, will return a json list of the \
                          revision history. This history includes: involved user, \
                          timestamp and revision made.")
    def get(self, taskId):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        query = f"""
            SELECT  revId, userId, timestamp, revision
            FROM    revisions
            WHERE   taskId = '{taskId}'
            ORDER BY timestamp
            """

        c.execute(query)
        revisons = c.fetchall()
        conn.close()
        
        res = []
        for r in revisons:
            userDict = getUserByID(r[1])
            revDict = {
                "revisonId": r[0],
                "userName": userDict["first_name"] + " " + userDict["last_name"],
                "timestamp": r[2],
                "revison": json.loads(r[3])
                }
            res.append(revDict)
        
        return json.dumps(res), 200
        
        
rollback_payload = api.model('rollback', {
    "taskId":       fields.Integer,
    "revisionId":   fields.Integer
})
@api.route('/rollback', methods=['POST'])
class Tasks(Resource):
    @api.response(200, 'Sucessfully modified task back to the requested old state')
    @api.response(400, 'Database error')
    @api.expect(rollback_payload)
    @api.doc(description="Given a taskId and revisonID, will update task to have \
                          the old state. Non-reversible process. Will return \
                          True if sucessfully executed, False otherwise")
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('taskId', required=True)
        parser.add_argument('revisionId', required=True)

        args = parser.parse_args()
        
        taskId = int(args.taskId)
        revId = int(args.revisionId)
        
        taskState, currRevId = assembleTask(taskId, revId)

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        for field, newVal in taskState.items():
            query = f"""
                    UPDATE  tasks
                    SET     {field} = '{newVal}'
                    WHERE   id = {taskId};
                    """
            try:
                c.execute(query)
                conn.commit()
            except:
                print("Error at rollback update")
                return {"value": False}, 400
        
        # Delete revision entries with revId greater than the argument supplied
        query = f"""
                DELETE
                FROM    revisions
                WHERE   taskId = '{taskId}'
                AND     revId > '{revId}';
                """
        try:
            c.execute(query)
            conn.commit()
        except:
            print("Error at rollback delete")
            return {"value": False}, 400

        
        return {"value": True}, 200

### Helper Functions ###
# Return a dictionary representation of a task in the database
def getTaskbyId(taskId):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, file_paths
            FROM    tasks
            WHERE   id = '{taskId}'
            """
    c.execute(query)
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

# Add entry into the "revisions" table for a new task. Field are initialised
# as the values intially passed in to create the task
def revisionsInitialise(taskId):
    revision = getTaskbyId(taskId)
    owner = revision["owner"]
    
    # Remove non-revisiable fields
    del revision["owner"]
    del revision["creation_date"]
    del revision["labels"]
    del revision["file_paths"]

    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            INSERT INTO revisions (taskId, revId, userId, timestamp, revision)
            VALUES ('{taskId}', '{0}', '{owner}', '{dt.datetime.now().strftime("%H:%M on %d %b %Y")}', '{json.dumps(revision)}');
            """
    try:
        c.execute(query)
        conn.commit()
        conn.close()
    
    except:
        conn.close()
        return False
        
    return True

# On updating an exisiting task, the "revisions" table will keep track of 
# changes made to the task and assign an unique revId
def revisionsAppend(taskId, userId):
    currTaskState = getTaskbyId(taskId)
    oldTaskState, maxRevId  = assembleTask(taskId, -1)
    
    revision = {}
    # Create a dictionary of the changes between the task in the "tasks" table and 
    # the task within the "revisions" table
    for field, oldVal in oldTaskState.items():
        if (currTaskState[field] != oldVal):
            revision[field] = currTaskState[field]
    
    # Check if revisions is empty
    if bool(revision) is False:
        return True
    
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            INSERT INTO revisions (taskId, revId, userId, timestamp, revision)
            VALUES ('{taskId}', '{maxRevId + 1}', '{userId}', '{dt.datetime.now().strftime("%H:%M on %d %b %Y")}', '{json.dumps(revision)}');
            """
    try:     
        print(query)
        c.execute(query)
        conn.commit()
        conn.close()
    except:
        conn.close()
        return False
    
    return True

# Get the state of a task's fields that may change at revId. If revId = -1, it
# will return the latest task object according to the "revisions" database.
def assembleTask(taskId, revId):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            SELECT  revId, revision
            FROM    revisions
            WHERE   taskId = '{taskId}'
            ORDER BY revId DESC;
            """
    
    c.execute(query)    
    revisionList = c.fetchall()
    conn.close()
    
    # Assemble the task, prioritising fields that have more recently updated
    # excluding edits made after the supplied revID
    resTask = {}
    for revision in revisionList:
        # Ignore changes occuring after revID. revId = -1 means get all changes
        if (revId != -1):
            if revId < revision[0]:
                continue
            
        revDict = json.loads(revision[1])

        for field, val in revDict.items():
            if field in resTask:
                continue
            else:
                resTask[field] = val
    
    return resTask, revisionList[0][0]