from functions import *
from datetime import *



def parseIntent(intent, dfResponse, email, initMsg):
    #currently does not reflect in front end???
    if(intent == "AddTask"):
        today = date.today()
        params = dfResponse.query_result.parameters
        #Access params via:
        title = params.fields['task'].string_value
        deadline = params.fields['date'].string_value.split('T')[0]
        print(title)
        print(deadline)
        
        addTask(email, title, title, today, deadline, labels="", current_state="Not Started", time_estimate=1, assigned_to=email)
        response = {'fulfillment_text': "I have added a task!"}

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
