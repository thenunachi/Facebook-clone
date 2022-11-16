from flask import Blueprint, request, redirect

from ..models import Post,Comment,db,Like
from flask_login import current_user

like_routes = Blueprint('likes',__name__)

@like_routes.route('/<int:likeId>',methods=["DELETE"])
def disLike(likeId):
     deletedLike = Like.query.get(likeId)
     if deletedLike:
          db.session.delete(deletedLike)
          db.session.commit()
          return{"message": "Like has been removed"}
     return { 'message': "This like does not exist"}
  

