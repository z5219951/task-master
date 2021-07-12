import json

from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

from db import *

bp = Blueprint('user', __name__, url_prefix='/user')
api = Namespace("user", "Operations for user")


# get user info
@api.route('/user/<int:id>', methods=['GET'])
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
            'company': f'{data[7]}'
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
                        company = '{args.company}'
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

