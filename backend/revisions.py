from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3
import datetime as dt
import json
import os

from friends import getUserByID
from labels import rawStrToList
import tasks

bp = Blueprint('revisions', __name__, url_prefix='/revisions')
api = Namespace("revisions", "Operations for task edit history and rollback")


@api.route('/<int:taskId>', methods=['GET'])
class Tasks(Resource):
    @api.response(200, 'Sucessfully returned list of revisions')
    @api.response(400, 'Unexpected error')
    @api.doc(description="Given a taskId, will return a json list of the \
                          revision history. This history includes: involved user, \
                          timestamp, revision dictionary, and rollbackTime \
                          (The orignal time of the rollbacked revision, 0 otherwise).")
    def get(self, taskId):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        revList = getRevisions(taskId)
        res = []
        for r in revList:
            userDict = getUserByID(r["userId"])
            diff, rollbackTime = revisionDiff(int(r["taskId"]), int(r["revId"]))
            
            revDict = {
                "revisionId":  r["revId"],
                "userName":    userDict["first_name"] + " " + userDict["last_name"],
                "userEmail":   userDict["email"],
                "timestamp":   r["timestamp"],
                "revision":    diff,
                "rollbackTime":rollbackTime
                }
            res.append(revDict)
        
        return json.dumps(res), 200
        
        
rollback_payload = api.model('rollback', {
    "taskId":       fields.Integer,
    "userId":       fields.Integer,
    "revisionId":   fields.Integer
})
@api.route('/rollback', methods=['POST'])
class Tasks(Resource):
    @api.response(200, 'Sucessfully modified task back to the requested old state')
    @api.response(400, 'Database error')
    @api.expect(rollback_payload)
    @api.doc(description="Given a taskId, userId, and revisonID, will update \
                          task to prior state. Returns True if sucessful, \
                          False otherwise")
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('taskId', required=True)
        parser.add_argument('userId', required=True)
        parser.add_argument('revisionId', required=True)

        args = parser.parse_args()
        
        taskId = int(args.taskId)
        userId = int(args.userId)
        revId = int(args.revisionId)
        
        # Check valid taskId
        revList = getRevisions(taskId)
        if len(revList) == 0:
            return {"value": False}, 200
        
        # Check validity of revID so that rollback is to an existing older state
        if (revId < 0) or (revId >= revList[-1]["revId"]):
            return {"value": False}, 200
                            
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        rollbackState = revList[revId]
        for field, newVal in rollbackState["revision"].items():
            query = f"""
                    UPDATE  tasks
                    SET     {field} = ?
                    WHERE   id = {taskId};
                    """
            c.execute(query, (str(newVal)))
            conn.commit()
        
        # Insert revision to the end of the "revisions" table
        index = revList[-1]["revId"] + 1
        
        if not revisionsInsert(taskId, index, userId, json.dumps(rollbackState["revision"]), revId):
            return {"value": False}, 400
        
        return {"value": True}, 200

### Helper Functions ###

# Add entry into the "revisions" table for a new task. Field are initialised
# as the values intially passed in to create the task
def revisionsAppend(taskId, userId):
    revision = tasks.getTaskbyId(taskId)
    
    # Remove non-revisible fields
    del revision["owner"]
    del revision["creation_date"]
    del revision["labels"]
    del revision["file_paths"]
    
    revList = getRevisions(taskId)

    if (len(revList) == 0):
        index = 0
    
    else:
         # Validate that there are changes
        if (revList[-1]["revision"] == revision):
            return False
        else:
            index = revList[-1]["revId"] + 1
    
    sucess = revisionsInsert(taskId, index, userId, json.dumps(revision), -1)
    
    return sucess

def revisionsInsert(taskId, revId, userId, revision, rollback):
    if revision ==  "{}":
        return False
    
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            INSERT INTO revisions (taskId, revId, userId, timestamp, revision, rollback)
            VALUES (?, ?, ?, '{dt.datetime.now().strftime("%H:%M on %d %b %Y")}', ?, ?);
            """
    c.execute(query, (f'{taskId}', f'{revId}',f'{userId}', f'{revision}', f'{rollback}'))
    conn.commit()
    conn.close()

    return True
    
def getRevisions(taskId):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            SELECT  taskId, revId, userId, timestamp, revision, rollback
            FROM    revisions
            WHERE   taskId = ?
            ORDER BY revId ASC;
            """
    try:
        c.execute(query, (str(userId)))    
        revisionList = c.fetchall()
        conn.close()

    except:
        conn.close()
        return []
    
    if len(revisionList) == 0:
        return []

    res = []
    for r in revisionList:
        revision = {
            "taskId":    int(r[0]),
            "revId" :    int(r[1]),
            "userId":    int(r[2]),
            "timestamp": r[3],
            "revision":  json.loads(r[4]),
            "rollback":  int(r[5])
        }
        res.append(revision)
    
    return res

def revisionDiff(taskId, revId):
    revList = getRevisions(taskId)
    
    # Base case. Difference for first revision entry is itself
    if (revId == 0):
        return revList[0]["revision"], 0
    
    currRevision = revList[revId]
    prevRevision = revList[revId - 1]
    
    # Check whether currRevision is a rollback
    rollbackIndex = currRevision["rollback"]
    rollbackTime = 0
    if rollbackIndex != -1:
        rollbackTime = revList[rollbackIndex]["timestamp"]
    
    diff = {}
    for field, newVal in currRevision["revision"].items():

        if prevRevision["revision"][field] != newVal:
            diff[field] = newVal
         
    return diff, rollbackTime