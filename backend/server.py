# standard library imports
import re

# third-party imports
from flask import Flask, request, jsonify
from flask_restx import Resource, Api, fields, inputs, reqparse
import psycopg2

# local imports
from backend.config import config

app = Flask(__name__)
api = Api(app,
          default="ClickDown",  # Default namespace
          title="Assignment 2",  # Documentation Title
          description="This page contains all of the REST requests that we service.")  # Documentation Description


#### HELPER FUNCTIONS ####
def valid_email(email):
    regex = '\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b'
    if (re.search(regex, email)):
        return True
    else:
        return False


# Register an account
# Assumes info is sent in POST body through a form
parser = reqparse.RequestParser()
parser.add_argument('first name', required=True, help='First name', location='form')
parser.add_argument('last name', required=True, help='Last name', location='form')
parser.add_argument('email', required=True, help='Email address', location='form')
# add more arguments when necessary

@api.route('/clickdown/register', methods=['POST'])
class Account(Resource):
    # Use received information to register an account
    @api.response(200, 'New account registered successfully')
    @api.response(400, 'Bad request')
    @api.doc(description="Register a new account")
    @api.expect(parser)
    def post(self):
        first_name = request.args.get('first name')
        last_name = request.args.get('last name')
        email = request.args.get('email')

        # if email is not valid, return error message
        if (not valid_email(email)):
            return {'message': f'You have not entered a valid email'}, 400

        conn = psycopg2.connect(config())
        c = conn.cursor()



#### DELETE THIS FUNCTION LATER
def connect():
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
		
        # create a cursor
        cur = conn.cursor()
        
	    # execute a statement
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')

        # display the PostgreSQL database server version
        db_version = cur.fetchone()
        print(db_version)
       
	    # close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

if __name__ == '__main__':
    conn = psycopg2.connect(config())
    # do stuff
    conn.close()

    app.run(debug=True)