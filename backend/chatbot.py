from friends import *
from functions import *
from datetime import *

def parseIntent(intent, dfResponse, email, initMsg):
    owner = getOwner(email)
    #default response if no intent found
    response = {'fulfillment_text': "Sorry, I don't understand. Please rephrase and try again. Ask for help to see suggested intents."}
    #Handles adding a task
    if(intent == "AddTask"):
        today = date.today()
        params = dfResponse.query_result.parameters
        title = params.fields['task'].string_value
        deadline = params.fields['date'].string_value.split('T')[0]
        owner = getOwner(email)
        addTask(owner, title, title, today, deadline, labels="", current_state="Not Started", time_estimate=1, assigned_to=owner)
        response = {'fulfillment_text': "I have added a task called \"{}\" for {}!".format(title, deadline)}

    #Handles retrieving a task list
    elif(intent == "CheckTaskByDate"):
        params = dfResponse.query_result.parameters
        endDate = params.fields['date-time'].struct_value.fields['endDate'].string_value.split('T')[0]
        startDate = params.fields['date-time'].struct_value.fields['startDate'].string_value.split('T')[0]
        #Single date request
        if(startDate == ""):
            singleDate = params.fields['date'].list_value.values[0].string_value.split('T')[0]
            tasks = getTasksOnADate(owner, singleDate)
            dailyTaskList = ''
            for i in tasks:
                dailyTaskList+=i[0] + ", "
            taskQueryRes = dailyTaskList[0:len(dailyTaskList)-2]
            if(len(tasks)>1):
                response = {'fulfillment_text': "Your tasks for {} are \"{}\"".format(singleDate, taskQueryRes)}
                return response
            elif(len(tasks)==1):
                response = {'fulfillment_text': "Your task for {} is \"{}\"".format(singleDate, taskQueryRes)}
                return response
            else:
                response = {'fulfillment_text': "You don't have any tasks for {}".format(singleDate)}
                return response
        #date-range request
        else:
            startDateObj = datetime.strptime(startDate, '%Y-%m-%d')
            endDateObj = datetime.strptime(endDate, '%Y-%m-%d')
            res = ""
            while(startDateObj <= endDateObj):
                startDateStr = str(startDateObj).split(" ")[0]
                startDateObj += timedelta(days=1)
                tasks = getTasksOnADate(owner, startDateStr)
                if(len(tasks)>0):
                    res += startDateStr + " "
                    for i in tasks:
                        res += str(i[0]) + " "
                    res += "\n"
            response = {'fulfillment_text': "Your tasks are as follows: \"{}\"".format(res)}

    #Handle getting potential connection list
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

    #Handle accepting a connection if it exists
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
        owner = getOwner(email)
        users = getUsersByFirstLastName(firstName , lastName)
        if (len(users) > 1):
            # Return Error
            response = {'fulfillment_text': "You have multiple requests named {} {}. Please try again or use the interface to confirm the request.".format(firstName, lastName)}
            return response
        elif(len(users) == 0):
            response = {'fulfillment_text': "No user named {} {} exists. Please try again.".format(firstName, lastName)}
            return response
        if(friendRequestRemove(users[0][0], owner)):
            friendListAdd(users[0][0] , owner)
            response = {'fulfillment_text': "Accepted request for {}".format(firstName + " " + lastName)}
            return response
        response = {'fulfillment_text': "Request failed, no request found for {}".format(firstName + " " + lastName)}


    #Handle declining a connection if it exists
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
        owner = getOwner(email)
        users = getUsersByFirstLastName(firstName , lastName)
        if (len(users) > 1):
            # Return Error
            response = {'fulfillment_text': "You have multiple requests named {} {}. Please try again or use the interface to delete the request.".format(firstName, lastName)}
            return response
        elif(len(users) == 0):
            response = {'fulfillment_text': "No user named {} {} exists. Please try again.".format(firstName, lastName)}
            return response
        if (friendRequestRemove(users[0][0] , owner )):
            response = {'fulfillment_text': "Declined request for {}".format(firstName + " " + lastName)}
            return response
        response = {'fulfillment_text': "Request failed, no request found for {}".format(firstName + " " + lastName)}
        return response

    #Tells user what options they have available in the chatbot on request
    elif(intent=="Help"):
        response = {'fulfillment_text': "I can help you to add a task, check what tasks you have and when, tell you who wants to connect with you and manage these connections."}
        return response


    return response
