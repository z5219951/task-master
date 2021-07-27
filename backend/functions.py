import json
from pathlib import PurePath, Path
import os
from werkzeug.utils import secure_filename

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from db import *

#Accept connection
###Add task
#Check Requested Connections
#CheckTaskByDate
#DeclineConnection
#RequestConnection
#search for user

def getOwner(email):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT id
                FROM users
                WHERE email = '{email}'
                """
        c.execute(query)
        print(query)
        id = c.fetchone()[0]
        conn.commit()
        c.close()
        conn.close()
        return id


def addTask(owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            INSERT INTO tasks (owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to)
            VALUES ('{owner}', '{title}', '{description}', '{creation_date}', '{deadline}', '{labels}', '{current_state}', '{time_estimate}', '{assigned_to}');
            """
    c.execute(query)
    print(query)

    query = f"""
            SELECT  id
            FROM    tasks
            WHERE   owner = '{owner}'
            AND     title = '{title}'
            AND     description = '{description}'
            AND     creation_date = '{creation_date}';
            """
    c.execute(query)
    id = c.fetchone()[0]

    conn.commit()
    c.close()
    conn.close()

def getAllTasks(owner):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to
                FROM    tasks
                WHERE   owner = '{owner}'
                ORDER BY    deadline NULLS LAST;
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
                'assigned_to': f'{data[9]}'
                }
                task_list.append(task_info)
                data = c.fetchone()

        # print(task_list)

        c.close()
        conn.close()

        return json.dumps(task_list)

def getAssignedTasks(owner):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to
                FROM    tasks
                WHERE   assigned_to = '{owner}'
                ORDER BY    deadline NULLS LAST;
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
                'assigned_to': f'{data[9]}'
            }
            task_list.append(task_info)
            data = c.fetchone()

        # print(task_list)

        c.close()
        conn.close()

        return json.dumps(task_list)

def updateTask(owner, title, description, creation_date, deadline, labels, current_state, time_estimate, assigned_to, id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE  tasks
                SET     owner = '{owner}',
                        title = '{title}',
                        description = '{description}',
                        creation_date = '{creation_date}',
                        deadline = '{deadline}',
                        labels = '{labels}',
                        current_state = '{current_state}',
                        time_estimate = '{time_estimate}',
                        assigned_to = '{assigned_to}'
                WHERE   id = '{id}';
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