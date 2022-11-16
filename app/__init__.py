import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from flask_socketio import SocketIO,send,join_room
from app.forms.chat_form import ChatForm
from flask_login import current_user

from .models import db, User,Chat,Like
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.post_routes import post_routes
from .api.comment_routes import comment_routes
from .api.like_routes import like_routes

from .seeds import seed_commands

from .config import Config

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*") #SocketIO is being applied to ‘app’ and is later being stored in socketio variable which enables us to use socketio instead of app in running the application. socketio encapsulates startup of the web server, i.e. app.
# CORS_ALLOWED_ORIGINS is the list of origins authorized to make requests.

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(post_routes, url_prefix='/api/posts')
app.register_blueprint(comment_routes,url_prefix='/api/comments')
app.register_blueprint(like_routes,url_prefix='/api/likes')
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

@app.route('/chat',methods=["POST"])
def chat():
    form = ChatForm()
    user = current_user.to_dict()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = Chat(
            sender_Id = user['id'],
            message = form.data['message']
        )
        db.session.add(data)
        db.session.commit()
    
        print({"chat": data.to_dict_chat()})
        return {"chat": data.to_dict_chat()}
    return form.errors




# When some client emit event using message name this funtion will call and send that message to every client listens on our server
@socketio.on('sendmessage')
def handle_message(msg,id):
    print(id,"*******ID")
    print(msg)
    room = id
    print(room,"ROOM &&&&&&&&")
    send(msg, to=room)
    return None #To receive WebSocket messages from the client, the application defines event handlers using the socketio.on decorator and it can send reply messages to the connected client using the send() and emit() functions.


# Run the App
if __name__ == '__main__':
    socketio.run(app, debug=True) #debug=True enables to sort out the errors with ease.