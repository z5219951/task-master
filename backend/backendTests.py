from subprocess import run
import requests
import sys
import os
import json

urlRoot = "http://localhost:5000/"

user1 = {
    "username": "MarceloA",
    "password": "Testing123",
    "email": "1@gmail.com",
    "first_name": "Marcelo",
    "last_name": "Alba",
    "phone_number": "10000",
    "company": "Marcelo's"
}
    
user2 = {
    "username": "BryanN",
    "password": "Testing123",
    "email": "2@gmail.com",
    "first_name": "Bryan",
    "last_name": "Nice",
    "phone_number": "20000",
    "company": "Marcelo's"
}

user3 = {
    "username": "AdrianT",
    "password": "Testing123",
    "email": "3@gmail.com",
    "first_name": "Adrian",
    "last_name": "Tober",
    "phone_number": "30000",
    "company": ""
}

user4 = {
    "username": "IvanS",
    "password": "Testing123",
    "email": "7@gmail.com",
    "first_name": "Ivan",
    "last_name": "Schuster",
    "phone_number": "70000",
    "company": ""
}

user5 = {
    "username": "MarianneW",
    "password": "Testing123",
    "email": "4@gmail.com",
    "first_name": "Marianne",
    "last_name": "Wendel",
    "phone_number": "40000",
    "company": "Marcelo's"
}

user6 = {
    "username": "Jennifer",
    "password": "Testing123",
    "email": "5@gmail.com",
    "first_name": "Jennifer",
    "last_name": "Ready",
    "phone_number": "50000",
    "company": "Jenn's"
}

user7 = {
    "username": "MosiG",
    "password": "Testing123",
    "email": "6@gmail.com",
    "first_name": "Mosi",
    "last_name": "Göransson",
    "phone_number": "60000",
    "company": "Jenn's"
}

user8 = {
    "username": "charles",
    "password": "123456Qq",
    "email": "1105282259@qq.com",
    "first_name": "Yue",
    "last_name": "Qi",
    "phone_number": "12345",
    "company": "Clickdown!"
}

def register():
    route = urlRoot + "register"
    
    r = requests.post(route, user1)
    if (r.status_code != 200):
        sys.exit("user1")
    r =requests.post(route, user2)
    if (r.status_code != 200):
        sys.exit("user2")
    r =requests.post(route, user3)
    if (r.status_code != 200):
        sys.exit("user3")
    r = requests.post(route, user4)
    if (r.status_code != 200):
        sys.exit("user4")
    r = requests.post(route, user5)
    if (r.status_code != 200):
        sys.exit("user5")
    r = requests.post(route, user6)
    if (r.status_code != 200):
        sys.exit("user6")
    r = requests.post(route, user7)
    if (r.status_code != 200):
        sys.exit("user7")
    r = requests.post(route, user8)
    if (r.status_code != 200):
        sys.exit("user7")
    
def login():
    route = urlRoot + "login"
    
    r = requests.post(route, user1)
    if '1' not in r.text:
        print(r.text)
        sys.exit("login id not 1")
        
    r = requests.post(route, user5)
    if '5' not in r.text:
        sys.exit("login id not 5")

def taskCreate():
    route = urlRoot + "tasks/create"
    
    task1= { 
        "owner" : "1",
        "title" : "Train Bryan in the use of clickdown",
        "description": "Bryan is a new member of the team",
        "creation_date": "2021-08-01",
        "deadline": "2021-08-01"
    }
    
    requests.post(route, task1)
    
if __name__ == "__main__":
    response = ''
    while (response != "Y"):
        response = input("This will resest your database.  [Y, n]\n")
        
        if response == "n":
            sys.exit("Finished executing")
    
    print("Checking that server.py is running...")
    
    try:
        requests.get(urlRoot)
        print("ok\n")
    except:
        print("Please run server from root with 'python3 backend/server.py'\n")
        sys.exit("Finished executing")
    
    print("Resetting database...")
    dirname = os.path.dirname(__file__)
    init_db = os.path.join(dirname, 'init_database.py')
    run(["python3", init_db])
    print("ok\n")
    
    print("Testing registration...")
    register()
    print("ok\n")

    print("Testing login...")
    login()
    print("ok\n")
    
    print("Testing task creation...")
    taskCreate()
    print("ok\n")

    # print("Testing update...")
    # print("ok\n")
    
    # print("Testing rollback...")
    # print("ok\n")
    # print("Testing task search...")
    # print("ok\n")
    # print("Testing projects...")
    # print("ok\n")
    # print("Testing groups...")
    # print("ok\n")
    # print("Testing user search...")
    # print("ok\n")
    # print("Testing user connect...")
    # print("ok\n")
    # print("Testing user accept connection...")
    # print("ok\n")
    
    