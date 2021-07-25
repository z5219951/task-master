from functions import *


def parseIntent(intent, req):
    # if(intent == "LogMeIn"):
    #     username = req["queryResult"]["parameters"]["user"]
    #     password = req["queryResult"]["parameters"]["password"]
    #     result = authUser(username, password)
    #     print(result)
    #     if(result == ''):
    #         response = {'fulfillment_text': "You don't seem to be real, please try again"}
    #     else:
    #         response = {'fulfillment_text': "You're now logged in as {}".format(username)}
    #         #want to push a session/user pair to the database.
    #         req["session"]
    if(intent == "AddTask"):
        response = {'fulfillment_text': "I need to add a task!"}
        #Handle adding a task
    elif(intent == "CheckTaskByDate"):
        response = {'fulfillment_text': "I need to retrieve tasks on a specific day!"}
        #Handle getting tasks for date period
    elif(intent == "CheckRequestedConnections"):
        response = {'fulfillment_text': "I need to check who wants to connect with you."}
        #Handle getting potential connection list
    elif(intent == "AcceptConnection"):
        response = {'fulfillment_text': "I need to see if this person wants to connect with you and approve it."}
        #Handle accepting a user's connection request
    elif(intent == "DeclineConnection"):
        response = {'fulfillment_text': "I need to see if this person wants to connect with you and decline it."}
        #Handle rejecting a user's connection request
    return response

#New Idea
#Need to log into the chatbot first. 
# Once logged in, records a session ID and ties it to the username - storing in database.
