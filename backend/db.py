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
            SELECT  id, username, password, email, first_name, last_name, phone_number, company, labels
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
            SELECT  id, username, password, email, first_name, last_name, phone_number, company, labels
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
            "company":      data[7],
            "labels":       data[8]
        }
    
    return userDict
        

### Friend database functions ### 
def friendRequestAdd(user_from, user_to):
    # Check that users from args exists
    user = getUserByID(user_from)
    if user == []:
        return False
    
    user = getUserByID(user_to)
    if user == []:
        return False
    
    if user_from == user_to:
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

def friendsListGet(userId):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    # Find all entries that "user a" is friends with "user b", vice versa
    query = f"""
            CREATE TEMP TABLE friends
            AS SELECT user_a
            FROM friend_list
            WHERE user_b = '{userId}'
            UNION
            SELECT user_b
            FROM friend_list
            WHERE user_a = '{userId}'
            """
    c.execute(query)

    query = f"""
            SELECT id, first_name, last_name, email
            FROM users
            INNER JOIN friends ON users.id = friends.user_a
            """
    c.execute(query)
    
    data = c.fetchall()    
    conn.close()
    
    res = []
    for d in data:
        res.append({"requestedUser" : d[0],
                    "name" : d[1] + " " + d[2],
                    "email": d[3]})
    return res
    
def searchUsers(needle):
    conn = sqlite3.connect('clickdown.db')
    c = conn.cursor()
    
    needle = needle.lower()
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
    
    split = needle.split()
    # If len > 1 assume input string is FIRST LAST
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
    
    return res