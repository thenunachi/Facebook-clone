from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User


friend_routes =Blueprint('friends',__name__)

@friend_routes.route('/')
@login_required
def usersList():
    users = User.query.all()
    print(users,"users from session $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    return {'users': [user.to_dict() for user in users]}