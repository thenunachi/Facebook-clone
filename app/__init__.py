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

app = Flask(__name__, static_folder='../react-app/build', static_url_path='/')
socketio = SocketIO(app, cors_allowed_origins="*") #SocketIO is being applied to ‘app’ and is later being stored in socketio variable which enables us to use socketio instead of app in running the application. socketio encapsulates startup of the web server, i.e. app.
# CORS_ALLOWED_ORIGINS is the list of origins authorized to make requests.

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

users={}
clients = 0
onlineUsers={}
userlist={}
usersListOfNames = set()
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


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def react_root(path):
#     if path == 'favicon.ico':
#         return app.send_static_file('favicon.ico')
#     return app.send_static_file('index.html')


@app.route('/chat/<int:receiverId>',methods=["POST"])
def chat(receiverId):
    form = ChatForm()
    user = current_user.to_dict()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        
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

@app.route('/chat', methods=['GET'])
def allmessages():
    sender_id = request.args.get('sender_id')
    receiver_id = request.args.get('receiver_id')

    if sender_id is not None and receiver_id is not None:
        # Filter messages based on sender_id and receiver_id
        filtered_messages = Chat.query.filter(
            ((Chat.sender_Id == sender_id) & (Chat.receiver_Id == receiver_id)) |
            ((Chat.sender_Id == receiver_id) & (Chat.receiver_Id == sender_id))
        ).all()

        return {'chat': [c.to_dict_chat() for c in filtered_messages]}

    # If sender_id and receiver_id are not provided, return all messages
    all_msg = Chat.query.all()
    return {'chat': [c.to_dict_chat() for c in all_msg]}



# When some client emit event using message name this funtion will call and send that message to every client listens on our server

#To receive WebSocket messages from the client, the application defines event handlers using the socketio.on decorator and it can send reply messages to the connected client using the send() and emit() functions.


@socketio.on('connect',namespace="/")
def handle_connect():
    print(f'User connected: {request.sid}')
    emit('users', {'user_count': len(usersListOfNames)}, broadcast=True)
   
@socketio.on('login')
def handle_login(data):
    user_id = data['userId']
    usersListOfNames.add(user_id)
    emit('users', {'user_count': len(usersListOfNames)}, broadcast=True)
    emit('usersNames', {'users': list(usersListOfNames)}, broadcast=True)
    

@socketio.on('logout')
def handle_logout(data):
    user_id = data['userId']
    print(f'User {user_id} disconnected')
    print(data , "data from frontend")
    usersListOfNames.discard(user_id)  
    print(usersListOfNames,"usersListOfNames") 
    emit('users', {'user_count': len(usersListOfNames)}, broadcast=True)
    emit('usersNames', {'users': list(usersListOfNames)}, broadcast=True)   
    print(list(usersListOfNames),"usersListOfNames")
    print(f'User {user_id} logged out')




@socketio.on('username',namespace='/private')
def get_users_sid(username):
    users[username] = request.sid
    

    
@socketio.on('privatemsg',namespace='/private')
def private_msg(payload):  
    receiver_session_id = payload['receiver_Id']
    sender_session_id = payload['sender_Id']
    
    if receiver_session_id and sender_session_id:
        
        emit('new_private_msg', payload['message'], room=receiver_session_id)
        emit('new_private_msg', payload['message'], room=sender_session_id)


# Run the App
if __name__ == '__main__':
    socketio.run(app, debug=True) #debug=True enables to sort out the errors with ease.


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')