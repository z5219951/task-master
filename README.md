# capstoneproject-comp3900-w10a-clickdown

# Introduction
Be a master of tracking where you and your collaborators are with tasks that you've got
an interest in, using ClickDown. This platform will allow clickers to maintain a
profile that shows tasks being worked on at a glance, where clickers can connect
with others on the platform, and communicate the state of each of their tasks through
the platform. It provides an easy way to create and assign tasks to fellow clickers you
collaborate with, and search for any tasks within your network of clicker
collaborators. You can even see an estimate of how busy each of your connected clickers is.

# Setting up and Running the System
3rd party requirements: Ngrok is needed in order to correctly forward the local deployment to dialogflow for running the chatbot. Ngrok can be downloaded from here: https://ngrok.com/download
### NGROK (for chatbot functionalities)
#### Installation:
1. Open a terminal where ‘ngrok.exe’ is located
2. Run $ ./ngrok authtoken 1fO0GH3r1oJj1g1d2NkAhF6Ofhu_2yJz2aRc9WaN7aEgdMQb8
#### Running the server:
1. Open a terminal where ‘ngrok.exe’ is located
2. Run $ ./ngrok http -region=au -hostname=comp3900.au.ngrok.io 5000  

This will expose port 5000 to the public url comp3900.au.ngrok.io which allows Dialogflow to send processed messages.
### BACKEND
#### Installation:
1. Open a terminal in the ‘/backend’ folder of the repository
2. Run $ pip3 install -r requirements.txt
3. Run $ sudo apt-get install sqlite3
#### Running the server:
1. Open a terminal in the ‘/backend’ directory of the repository
2. Run $ python3 init_database.py
3. Run $ python3 server.py

### FRONTEND
#### Installation:
1. Open a terminal in the ‘/frontend’ directory of the repository
2. Run $ yarn install
#### Running the application:
1. Open a terminal in the ‘/frontend’ directory of the repository
2. Run $ yarn start
3. To access the web page, type the following on your web browser:
http://localhost:3000
4. To access the API, type the following on your web browser:
http://localhost:5000



## Issues
It will take a while to install all the dependencies in this project. Furthermore, launching the app will also take times. Please contact us if there is anything wrong, appreciated.

## Teams
- Nicholai Rank `z5115301@unsw.edu.au`
- Gavin Wang `z5206647@student.unsw.edu.au`
- Justin Pham `z5075823@student.unsw.edu.au`
- Ka Wayne Ho `z5139681@student.unsw.edu.au`
- Yue Qi `z5219951@student.unsw.edu.au`
