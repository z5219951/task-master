import sqlite3
import random

def email_exists(email):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  count(*)
            FROM    users
            WHERE   email = ?;
            """
    c.execute(query, [f'{email}'])
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
            WHERE   username = ?;
            """
    c.execute(query, [f'{username}'])
    count = c.fetchone()[0]

    if (count == 1):
        return True
    return False

def getUserByID(id):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    query = f"""
            SELECT  id, username, password, email, first_name, last_name, phone_number, company, labels, image_path
            FROM    users
            WHERE   id = ?;
            """

    c.execute(query, [f'{id}'])
    data = c.fetchone()
    c.close()
    conn.close()

    return data


def getUsersByFirstLastName(firstName , lastName):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    firstName = firstName.lower()
    lastName = lastName.lower()
    query = f"""
            SELECT  id
            FROM    users
            WHERE   lower(first_name) = ?
            AND     lower(last_name) Like '%?%';
            """

    c.execute(query, (f'{firstName}', f'{lastName}'))
    data = c.fetchall()
    c.close()
    conn.close()

    return data
