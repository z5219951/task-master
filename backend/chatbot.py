from friends import *
from functions import *
from datetime import *

def parseIntent(intent, dfResponse, email, initMsg):
    if(intent == "AddTask"):
        today = date.today()
        params = dfResponse.query_result.parameters
        print(params)
        #Access params via:
        title = params.fields['task'].string_value
        deadline = params.fields['date'].string_value.split('T')[0]
        print(title)
        print(deadline)
        owner = getOwner(email)
        addTask(owner, title, title, today, deadline, labels="", current_state="Not Started", time_estimate=1, assigned_to=owner)
        response = {'fulfillment_text': "I have added a task {} for {}!".format(title, deadline)}
        #print(response)

    elif(intent == "CheckTaskByDate"):
        
        response = {'fulfillment_text': "I need to retrieve tasks on a specific day!"}
        #Handle getting tasks for date period
    elif(intent == "CheckRequestedConnections"):
        connRequests = getRequestedConnectionsList(email)
        reqConnections = ""
        for i in connRequests:
            reqConnections = reqConnections + i + " & "
        reqConnections = reqConnections[0:len(reqConnections)-2]
        if len(connRequests) > 1:
            response = {'fulfillment_text': "{}want to connect with you".format(reqConnections)}
        elif len(connRequests) == 1:
            response = {'fulfillment_text': "{}wants to connect with you".format(reqConnections)}
        else:
            response = {'fulfillment_text': "No one wants to connect with you"}
        print(response)
        #Handle getting potential connection list
    elif(intent == "AcceptConnection"):
        params = dfResponse.query_result.parameters
        fullName = params.fields['person'].struct_value['name']
        fullName = fullName.split(' ')
        firstName = fullName[0]
        lastName = ""
        i = 1
        while ( i < len(fullName)):
            lastName += fullName[i] + " "
            i += 1
        lastName = lastName[:-1]
        print(firstName + "   " + lastName)
        owner = getOwner(email)
        users = getUsersByFirstLastName(firstName , lastName)
        print(len(users))
        if (len(users) > 1):

            # Return Error
            response = {'fulfillment_text': "You have multiple requests named {} {}. Please try again or use the interface to confirm the request.".format(firstName, lastName)}
            print(response)
            return response
        elif(len(users) == 0):
            response = {'fulfillment_text': "No user named {} {} exists. Please try again.".format(firstName, lastName)}
            print(response)
            return response
        if(friendRequestRemove(users[0][0], owner)):
            friendListAdd(users[0][0] , owner)
            response = {'fulfillment_text': "Accepted request for {}".format(firstName + " " + lastName)}
            print(response)
            return response,200
        response = {'fulfillment_text': "Request failed, no request found for {}".format(firstName + " " + lastName)}
        print(response)
        #Handle accepting a user's connection request
    elif(intent == "DeclineConnection"):
        params = dfResponse.query_result.parameters
        fullName = params.fields['person'].struct_value['name']
        fullName = fullName.split(' ')
        firstName = fullName[0]
        lastName = ""
        i = 1
        while ( i < len(fullName)):
            lastName += fullName[i] + " "
            i += 1
        lastName = lastName[:-1]
        print(firstName + "   " + lastName)
        owner = getOwner(email)
        users = getUsersByFirstLastName(firstName , lastName)
        print(len(users))
        if (len(users) > 1):

            # Return Error
            response = {'fulfillment_text': "You have multiple requests named {} {}. Please try again or use the interface to delete the request.".format(firstName, lastName)}
            return response
        elif(len(users) == 0):
            response = {'fulfillment_text': "No user named {} {} exists. Please try again.".format(firstName, lastName)}
            return response
        if (friendRequestRemove(users[0][0] , owner )):
            response = {'fulfillment_text': "Declined request for {}".format(firstName + " " + lastName)}
            print(response)
            return response,200
        response = {'fulfillment_text': "Request failed, no request found for {}".format(firstName + " " + lastName)}
        print(response)
        return response,401
    return response
