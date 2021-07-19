import sqlite3
import random

def email_exists(email):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  count(*)
            FROM    users
            WHERE   email = '{email}';
            """
    c.execute(query)
    count = c.fetchone()[0]

    if (count == 1):
        return True
    return False

def user_exists(username):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  count(*)
            FROM    users
            WHERE   username = '{username}';
            """
    c.execute(query)
    count = c.fetchone()[0]

    if (count == 1):
        return True
    return False

def getUserByID(id):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    #Should we be grabbing the password from here?
    query = f"""
            SELECT  id, username, password, email, first_name, last_name, phone_number, company
            FROM    users
            WHERE   id = '{id}';
            """

    c.execute(query)
    data = c.fetchone()
    c.close()
    conn.close()

    return data