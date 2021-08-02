import json
from pathlib import PurePath, Path
import os
from werkzeug.utils import secure_filename

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from db import *

bp = Blueprint('user', __name__, url_prefix='/user')
api = Namespace("user", "Operations for user")


# get user info
@api.route('/<int:id>', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Successfully retrieved user info')
    @api.response(404, 'Not Found')
    @api.doc(description="Gets info for a user given their id. Returns dictionary \
    {id, password, email, first_name, last_name, phone_number, company,labels, image_path}")
    def get(self, id):
        data = getUserByID(id)

        if (data is None):
            return {'message': f'User not found'}, 404

        resp =  {
            'id': f'{data[0]}',
            'username': f'{data[1]}',
            'password': f'{data[2]}',
            'email': f'{data[3]}',
            'first_name': f'{data[4]}',
            'last_name': f'{data[5]}',
            'phone_number': f'{data[6]}',
            'company': f'{data[7]}',
            'labels': f'{data[8]}',
            'image_path': f'{data[9]}'
        }

        return json.dumps(resp)


# update user info
update_payload = api.model('update info', {
    "id": fields.String,
    "username": fields.String,
    "password": fields.String,
    "email": fields.String,
    "first_name": fields.String,
    "last_name": fields.String,
    "phone_number": fields.String,
    "company": fields.String,
    "labels": fields.String,
    "image_path": fields.String
})

@api.route('/update', methods=['PUT'])
class Users(Resource):
    @api.response(200, 'Successfully updated user info')
    @api.response(400, 'Bad Request')
    @api.doc(description="Updates info for a user. Returns dictionary {value} - \
    true if sucessful, false otherwise")
    @api.expect(update_payload)
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('username')
        parser.add_argument('password')
        parser.add_argument('email')
        parser.add_argument('first_name')
        parser.add_argument('last_name')
        parser.add_argument('phone_number')
        parser.add_argument('company')
        parser.add_argument('labels')
        parser.add_argument('image_path')
        args = parser.parse_args()

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE  users
                SET     username = ?,
                        password = ?,
                        email = ?,
                        first_name = ?,
                        last_name = ?,
                        phone_number = ?,
                        company = ?,
                        labels = ?,
                        image_path = ?
                WHERE   id = ?;
                """
        queryParams = (
            f'{args.username}',
            f'{args.password}',
            f'{args.email}',
            f'{args.first_name}',
            f'{args.last_name}',
            f'{args.phone_number}',
            f'{args.company}',
            f'{args.labels}',
            f'{args.image_path}',
            f'{args.id}'
        )
        
        try:
            c.execute(query, queryParams)
        except Exception as e:
            c.close()
            conn.close()
            return {'value': False}

        conn.commit()
        
        c.close()
        conn.close()

        return {'value': True}

# upload a profile picture
@api.route('/upload/<int:user_id>', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully uploaded a profile picture')
    @api.response(400, 'Bad Request')
    @api.doc(description="Receives a picture file and stores it in the backend. \
    Returns dict {url}, url of picture.")
    def post(self, user_id):
        image = request.files['image']
        filename = secure_filename(image.filename)

        if filename == '':
            return {'value': False}

        dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'users', str(user_id))
        os.makedirs(dir, exist_ok=True)
        path = os.path.join(dir, filename)

        image.save(path)

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        url = 'http://localhost:5000/uploads/users/' + str(user_id) + '/' + filename

        query = f'''
                UPDATE  users
                SET     image_path = ?
                WHERE   id = ?;
                '''
        c.execute(query, (f'{url}', f'{user_id}'))

        conn.commit()
        c.close()
        conn.close()

        return {'url': url}

search_payload = api.model('search', {
    "input": fields.String,
})
@api.route('/search', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Sucessfully searched for requests')
    @api.response(400, 'Not implemented')
    @api.expect(search_payload)
    @api.doc(description="Search for users based on name, email, company, phone.\
    return dict {requestedUser, username}. requestedUser is userId of user found \
    , username is FIRST LAST of found user")
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('input', required=True)
        args = parser.parse_args()
                
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()
        
        needle = args.input.lower()
        query = f"""
                SELECT  *
                FROM    users
                WHERE   lower(email) = ?
                or      lower(first_name) = ?
                or      lower(last_name) = ?
                or      phone_number = ?
                or      lower(company) = ?;
                """
        
        c.execute(query, (f'{needle}', f'{needle}',f'{needle}',f'{needle}',f'{needle}'))
        data = c.fetchall()
        
        # Check if search needle matches FIRST LAST
        split = needle.split()
        if len(split) > 1:
            first_name = split[0]
            last_name = split[1]
            
            query = f"""
            SELECT  *
            FROM    users
            WHERE   lower(first_name) = ?
            AND     lower(last_name) = ?
            """
            
            c.execute(query, (f'{first_name}', f'{last_name}'))
            data.append(c.fetchone())
        
        res = []
        for d in data:
            if d == None:
                break
            res.append({"requestUser": d[0],
                        "username": d[4] + " " + d[5]})
        
        return json.dumps(res), 200


@api.route('/<int:id>/projects', methods=['GET'])
class Users(Resource):
    @api.response(200, 'Projects successfully received')
    @api.response(400, 'Bad request')
    @api.doc(description="Get all projects for a user. Return list of projects \
    [{id, name, description, tasks, groupid}]")
    def get(self, id):
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                SELECT  p.id, p.name, p.description, p.tasks, p.groupid
                FROM    projects p
                JOIN    groups g ON p.groupid = g.id 
                WHERE   g.user = ?;
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