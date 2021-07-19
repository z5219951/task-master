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
    @api.doc(description="Gets info for a user given their id")
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
        
        print(resp)
        
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
    "labels": fields.String
})

@api.route('/update', methods=['PUT'])
class Users(Resource):
    @api.response(200, 'Successfully updated user info')
    @api.response(400, 'Bad Request')
    @api.doc(description="Updates info for a user")
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
        args = parser.parse_args()
        # print(args)
        
        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f"""
                UPDATE  users
                SET     username = '{args.username}',
                        password = '{args.password}',
                        email = '{args.email}',
                        first_name = '{args.first_name}',
                        last_name = '{args.last_name}',
                        phone_number = '{args.phone_number}',
                        company = '{args.company}',
                        labels = '{args.labels}'
                WHERE   id = '{args.id}';
                """
        try:
            c.execute(query)
        except:
            c.close()
            conn.close()
            # split up username and email later
            return {'value': False}

        conn.commit()
        
        c.close()
        conn.close()

        return {'value': True}

# upload a profile picture
@api.route('/upload/<int:id>', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully uploaded a profile picture')
    @api.response(400, 'Bad Request')
    @api.doc(description="Receives a picture file and stores it in the backend")
    def post(self, id):
        print(f'upload received user_id is: {id}')
        image = request.files['image']
        print(f'upload received filetype is: {type(image)}')
        filename = secure_filename(image.filename)

        if filename == '':
            return {'value': False}

        dir = PurePath(Path(__file__).parent.resolve(), 'users', str(id))
        os.makedirs(dir, exist_ok=True)
        path = PurePath(dir, filename)

        # path example: '/users/123/picture.png'
        print(f'path type is: {type(path)}')
        print(f'path name is: {path}')
        image.save(path)

        conn = sqlite3.connect('clickdown.db')
        c = conn.cursor()

        query = f'''
                UPDATE  users
                SET     image_path = {id + '/' + filename}
                WHERE   id = {id};
                '''

        print(f"stored in database: {id + '/' + filename}")

        conn.commit()
        c.close()
        conn.close()

        return {'value': True}

search_payload = api.model('search', {
    "input": fields.String,
})
@api.route('/search', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Sucessfully searched for requests')
    @api.response(400, 'Not implemented')
    @api.expect(search_payload)
    @api.doc(description="Search for users based on name, email, company, phone")
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
                WHERE   lower(email) = '{needle}'
                or      lower(first_name) = '{needle}'
                or      lower(last_name) = '{needle}'
                or      phone_number = '{needle}'
                or      lower(company) = '{needle}';
                """
        
        c.execute(query)
        data = c.fetchall()
        
        # Check if search needle matches FIRST LAST
        split = needle.split()
        if len(split) > 1:
            first_name = split[0]
            last_name = split[1]
            
            query = f"""
            SELECT  *
            FROM    users
            WHERE   lower(first_name) = '{first_name}'
            AND     lower(last_name) = '{last_name}'
            """
            
            c.execute(query)
            data.append(c.fetchone())
        
        res = []
        for d in data:
            if d == None:
                break
            res.append({"requestUser": d[0],
                        "username": d[4] + " " + d[5]})
        
        return json.dumps(res), 200
