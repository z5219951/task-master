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
    
def getUserByEmail(email):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    #Should we be grabbing the password from here?
    query = f"""
            SELECT  id, username, password, email, first_name, last_name, phone_number, company
            FROM    users
            WHERE   email = '{email}';
            """

    c.execute(query)
    data = c.fetchone()
    c.close()
    conn.close()

    return data

# Convert the above user data structures into a dictionary
def userDict(data):
    userDict = {}
    if data != None:
        userDict = {
            "id" :          data[0],
            "username":     data[1],
            "password":     data[2],
            "email":        data[3],
            "first_name":   data[4],
            "last_name":    data[5],
            "phone_number": data[6],
            "company":      data[7]
        }
    
    return userDict
        
    

def updateUser(id, username, password, email, first_name, last_name, phone_number, company):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            UPDATE  users
            SET     username = '{username}',
                    password = '{password}',
                    email = '{email}',
                    first_name = '{first_name}',
                    last_name = '{last_name}',
                    phone_number = '{phone_number}',
                    company = '{company}'
            WHERE   id = '{id}';
            """
    try:
        c.execute(query)
    except:
        c.close()
        conn.close()
        # split up username and email later
        return {'value': False}, 200

    conn.commit()
    
    c.close()
    conn.close()

    return {'value': True},200

def insertUser(id, username, password, email, first_name, last_name, phone_number, company):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            INSERT INTO users (username, password, email, first_name, last_name, phone_number, company)
            VALUES ('{username}', '{password}', '{email}', '{first_name}', '{last_name}', '{phone_number}', '{company}');
            """
    c.execute(query)
    conn.commit()

    c.close()
    conn.close()

def createTask(owner, title, description, creation_date, deadline, current_state, progress, time_estimate, difficulty):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            INSERT INTO tasks (owner, title, description, creation_date, deadline, current_state, progress, time_estimate, difficulty)
            VALUES ('{owner}', '{title}', '{description}', '{creation_date}', '{deadline}', '{current_state}', '{progress}', '{time_estimate}', '{difficulty}');
            """
    c.execute(query)
    conn.commit()

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

    c.close()
    conn.close()
    return id

def getTasks(owner):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    query = f"""
            SELECT  id, owner, title, description, creation_date, deadline, labels, current_state, progress, time_estimate, difficulty
            FROM    tasks
            WHERE   owner = '{owner}';
            """

    print(query)
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
            'progress': f'{data[8]}',
            'time_estimate': f'{data[9]}',
            'difficulty': f'{data[10]}'
        }
        task_list.append(task_info)
        data = c.fetchone()

    print(task_list)

    c.close()
    conn.close()
    return task_list

def authCheck(email, password):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    # retrieve id using email and password
    query = f"""
            SELECT  id
            FROM    users
            WHERE   email = '{email}' and password = '{password}';
            """
    c.execute(query)
    id = c.fetchone()
    c.close()
    conn.close()
    return id

def updatePassword(email, new_password):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    # change the password and reset code
    query = f"""
            UPDATE  users
            SET     password = '{new_password}', recovery = null
            WHERE   email = '{email}';
            """
    c.execute(query)
    conn.commit()

    c.close()
    conn.close()

def recoveryMatch(recovery):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()

    # is there a recovery code that matches?
    query = f"""
            SELECT  count(*)
            FROM    users
            WHERE   recovery = '{recovery}';
            """
    c.execute(query)
    count = c.fetchone()[0]
    c.close()
    conn.close()
    print(count)
    return count

def updateRecovery(recovery, email):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    query = f"""
            UPDATE  users
            SET     recovery = '{recovery}'
            WHERE   email = '{email}';
            """
    c.execute(query)
    conn.commit()
    c.close()
    conn.close()

### Friend database functions ### 
def friendRequestAdd(user_from, user_to):
    # Check that users from args exists
    print("in add")
    user = getUserByID(user_from)
    if user == []:
        return False
    
    user = getUserByID(user_to)
    if user == []:
        return False
        
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            INSERT INTO friend_requests (user_from, user_to)
            VALUES ('{user_from}', '{user_to}');
            """

    try: 
        c.execute(query)
        
    # If a request exists already
    except sqlite3.IntegrityError:
        return {'value': True},200

    conn.commit()
    
    return True

def friendRequestGet(email):
    requests_list = []
    
    data = getUserByEmail(email)
    userInfo = userDict(data)
    
    if userInfo == {}:
        return requests_list
            
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
        SELECT  user_from
        FROM    friend_requests
        WHERE   user_to = '{userInfo["id"]}'
        """
    
    c.execute(query)
    data = c.fetchall()
    
    for id in data:
        data = getUserByID(id[0])
        userInfo = userDict(data)
        userJson = {
            "requestUser": userInfo["id"],
            "userName"   : userInfo["first_name"] + " " +
                           userInfo["last_name"]
        }
        
    requests_list.append(userJson)
    
    return requests_list
    
# Delete from Table "friend_requests" given two user IDs
# Returns True if action is correctly executed, False if record cannot be found
def friendRequestRemove(user_from, user_to):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
        SELECT  *
        FROM    friend_requests
        WHERE   user_to = '{user_to}'
        AND     user_from = '{user_from}';
        """
    
    c.execute(query)
    data = c.fetchone()
    
    if data is None:
        return False
    
    else:
        query = f"""
                DELETE
                FROM    friend_requests
                WHERE   user_to = '{user_to}'
                AND     user_from = '{user_from}';
                """
        c.execute(query)
        conn.commit()
    
    return True
    
def friendListAdd(userA, userB):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    query = f"""
            INSERT INTO friend_list (user_a, user_b)
            VALUES ('{userA}', '{userB}');
            """
    c.execute(query)
    conn.commit()