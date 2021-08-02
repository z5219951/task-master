import json
from pathlib import PurePath, Path
import os
from werkzeug.utils import secure_filename

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from db import *
from friends import *

def getOwner(email):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT id
                FROM users
                WHERE email = ?
                """
        c.execute(query, [f'{email}'])
        id = c.fetchone()[0]
        conn.commit()
        c.close()
        conn.close()
        return id


def addTask(owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            INSERT INTO tasks (owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, reminded)
            VALUES (?,?,?,?,?,?,?,?,?, 0);
            """
    queryParams = (
        f'{owner}',
        f'{title}',
        f'{description}',
        f'{creation_date}',
        f'{deadline}',
        f'{labels}',
        f'{current_state}',
        f'{time_estimate}',
        f'{assigned_to}'
    )
    
    c.execute(query, queryParams)

    query = f"""
            SELECT  id
            FROM    tasks
            WHERE   owner = ?
            AND     title = ?
            AND     description = ?
            AND     creation_date = ?;
            """
    queryParams = (
        owner,
        title,
        description,
        creation_date
    )
    
    c.execute(query, queryParams)
    id = c.fetchone()[0]

    conn.commit()
    c.close()
    conn.close()

def getAllTasks(owner):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  title
                FROM    tasks
                WHERE   owner = ?
                ORDER BY    deadline NULLS LAST;
                """

        c.execute(query, [f'{owner}'])
        data = c.fetchall()

        c.close()
        conn.close()

        return data

def getAssignedTasks(owner):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to
                FROM    tasks
                WHERE   assigned_to = ?
                ORDER BY    deadline NULLS LAST;
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
                'assigned_to': f'{data[9]}'
            }
            task_list.append(task_info)
            data = c.fetchone()

        c.close()
        conn.close()

        return json.dumps(task_list)

def updateTask(owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE  tasks
                SET     owner = ?,
                        title = ?,
                        description = ?,
                        creation_date = ?,
                        deadline = ?,
                        labels = ?,
                        current_state = ?,
                        time_estimate = ?,
                        assigned_to = ?
                WHERE   id = ?;
                """
        queryParams = (
            f'{owner}',
            f'{title}',
            f'{description}',
            f'{creation_date}',
            f'{deadline}',
            f'{labels}',
            f'{current_state}',
            f'{time_estimate}',
            f'{assigned_to}',
            f'{id}'
        )
        
        try:
            c.execute(query, queryParams)
        except:
            c.close()
            conn.close()
            return {'value': False}

        conn.commit()
        c.close()
        conn.close()

def getRequestedConnectionsList(email):
        requests_list = []
    
        userInfo = getUserByEmail(email)
        
        if userInfo == {}:
            return requests_list
                
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        query = f"""
            SELECT  user_from
            FROM    friend_requests
            WHERE   user_to = ?
            """
        
        c.execute(query, [f'{userInfo["id"]}'])
        friendRequests = c.fetchall()
        
        for id in friendRequests:
            userInfo = getUserByID(id[0])
            user = userInfo["first_name"] + " " + userInfo["last_name"]
            requests_list.append(user)
        
        return requests_list

def getTasksOnADate(owner, date):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        query = f"""
                SELECT  title
                FROM    tasks
                WHERE   owner = ?
                AND     deadline = ?
                AND     current_state IS NOT "Completed" 
                """    
        c.execute(query, (f'{owner}', f'{date}'))
        tasks = c.fetchall()
        conn.commit()
        c.close()
        conn.close()
        return tasks

