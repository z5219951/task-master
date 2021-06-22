# standard library imports


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