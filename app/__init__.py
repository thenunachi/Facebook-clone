import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from flask_socketio import SocketIO,send,join_room, leave_room,emit
from app.forms.chat_form import ChatForm
from flask_login import current_user

from .models import db, User,Chat,Like
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.post_routes import post_routes
from .api.comment_routes import comment_routes
from .api.like_routes import like_routes
from .api.friend_routes import friend_routes

from .seeds import seed_commands

from .config import Config

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*") #SocketIO is being applied to ‘app’ and is later being stored in socketio variable which enables us to use socketio instead of app in running the application. socketio encapsulates startup of the web server, i.e. app.
# CORS_ALLOWED_ORIGINS is the list of origins authorized to make requests.

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

users={}
clients = 0
onlineUsers=[]
userlist={}

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# def load_all_users():
#     return User.query.all()

# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(post_routes, url_prefix='/api/posts')
app.register_blueprint(comment_routes,url_prefix='/api/comments')
app.register_blueprint(like_routes,url_prefix='/api/likes')
app.register_blueprint(friend_routes,url_prefix='/api/users/all')
db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')

@app.route('/chat/<int:receiverId>',methods=["POST"])
def chat(receiverId):
    form = ChatForm()
    user = current_user.to_dict()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # print(form.data,"FORM DATA TO SEE WHAT IS GETTING PRINTED %%%%%%%%%%%%%%%")
        # print(socketio.sid,"what is socket.sid ?????????????????????????????????")
        data = Chat(
            sender_Id = user['id'],
            receiver_Id = receiverId,
            message = form.data['message'],
            # socketId = form.data['socketId']
        )
        db.session.add(data)
        db.session.commit()
    
        # print({"chat": data.to_dict_chat()})
        return {"chat": data.to_dict_chat()}
    return form.errors

@app.route('/chat',methods=['GET'])
def allmessages():
    all_msg = Chat.query.all()
    return {'chat': [c.to_dict_chat() for c in all_msg]}


# When some client emit event using message name this funtion will call and send that message to every client listens on our server

#To receive WebSocket messages from the client, the application defines event handlers using the socketio.on decorator and it can send reply messages to the connected client using the send() and emit() functions.

 
@socketio.on('connect',namespace="/")
def test_connect():
    # print(data,"data from frontend")
    global clients #global variable as it needs to be shared
    clients += 1
    # print('Client connected **************************************')
    # print(request.sid,"request.sid is generated???????????????????????????????????")
    # print((users),"users from connetct event")
    # print(onlineUsers,"onlineUsers")
    emit('users',{'user_count':clients},broadcast=True)# emits a message with the user count anytime someone connects
#     name = onlineUsers['username']
#     emit('active',(onlineUsers),broadcast=True)

@socketio.on('active',namespace="/online")
def active_users(data):
    print(data , "data from frontend")
    # print(onlineUsers[data['username']],"check the onlineusers getting value")
    onlineUsers.append(data['username'])
    print(onlineUsers,"onlineUSers")
    emit('activeUsers',(onlineUsers),broadcast=True)

@socketio.on('offline',namespace="/online")
def offline(data):
    print(data,"data from frontend") #{'username': 'Demo'} data from frontend
    onlineUsers.remove(data)
    # del onlineUsers['username']
    print(onlineUsers,"deleting the user")
    emit('offlineusers',(onlineUsers),broadcast=True)

# @socketio.on('disconnect',namespace="/")
# def test_disconnect():
#     global clients
#     clients -=1
#     print('*******', request.sid)
#     print(users,"users dict ****")
#     #  {'Demo': 'jXdYmfatQGuh3R5VAAAK'} ******* q99jeFDPwo5Wij4tAAAC
#     emit('users', {'user_count': clients}, broadcast=True)
#     print('Client disconnected')


    

@socketio.on('username',namespace='/private')
def get_users_sid(username):
    users[username] = request.sid
    # print(users, 'users?????????????????????????????????????????????????????????????????')

@socketio.on('privatemsg',namespace='/private')
def private_msg(payload):
    # print("***********")
    # print(users,"users obj?????????????????????????????????????????????????????????????????????????????????????")
    # print(users[payload['username']] ,"find the recipient getting value ????????????")
    receiver_session_id = users[payload['username']] 
    # print(receiver_session_id,"receiver session id in backend ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    message = payload['message']
    emit('new_private_msg',message,room=receiver_session_id)
    

@socketio.on('message')
def reply(message):
    # print("SOMETHING ELSE &&&&&&&&&&&&&&&&&&&&&",message)
   
    emit('message',message)

# @socketio.on('join')
# def on_join(data):
#     print(data,"DATA inside join function ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
#     sender_Id = data['sender_Id']
#     print(sender_Id,"senderId fron join room")
#     room = data["room"]
#     print(room,"room from join room")
#     message = data["message"]
#     join_room(room)
#     # send(sender_Id +'has joined the room', to=room)

# @socketio.on('leave')
# def on_leave(data):
#     username = data['username']
#     room = data['room']
#     leave_room(room)
#     send(username + ' has left the room.', to=room)

# Run the App
if __name__ == '__main__':
    socketio.run(app, debug=True) #debug=True enables to sort out the errors with ease.