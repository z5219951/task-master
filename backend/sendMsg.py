import os
import dialogflow
from google.api_core.exceptions import InvalidArgument

#Adapted from https://medium.com/swlh/working-with-dialogflow-using-python-client-cb2196d579a4

def sendMessage(msg):

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'applicationAuthServiceAcct.json'

    DIALOGFLOW_PROJECT_ID = 'taskmasterchatbot-wfsb'
    DIALOGFLOW_LANGUAGE_CODE = 'en'
    SESSION_ID = 'placeholder'

    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(DIALOGFLOW_PROJECT_ID, SESSION_ID)
    text_input = dialogflow.types.TextInput(text=msg, language_code=DIALOGFLOW_LANGUAGE_CODE)
    query_input = dialogflow.types.QueryInput(text=text_input)
    try:
        response = session_client.detect_intent(session=session, query_input=query_input)
    except InvalidArgument:
        raise
    return response



# print("Query text:", response.query_result.query_text)
# print(response)
# print("Detected intent:", response.query_result.intent.display_name)
# print("Detected intent confidence:", response.query_result.intent_detection_confidence)
# print("Fulfillment text:", response.query_result.fulfillment_text)