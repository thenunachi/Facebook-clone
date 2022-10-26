from flask import Blueprint, request, redirect
from app.forms.comment_form import CommentForm

from app.forms.post_form import EditPostForm, PostForm
from ..models import Post,Comment,db
from flask_login import current_user

post_routes = Blueprint('posts',__name__)

#Get all posts
@post_routes.route('/')
def get_all_posts():
     all_posts = Post.query.all()
     print("******************************POST", all_posts)
     return {'posts':[p.to_dict_relationship() for p in all_posts]}



# Get post by ownerId
@post_routes.route('/<int:ownerId>')
def get_posts_by_ownerId(ownerId):
     one_post = Post.query.get(ownerId)
     print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& one_post",one_post)
     return {'onePost' : one_post.to_dict_relationship()}

#Create a post
@post_routes.route('/',methods=["POST"])
def create_post():
     form = PostForm() #calling form
     form['csrf_token'].data = request.cookies['csrf_token']
     if form.validate_on_submit():
          data = Post() #assigning model
          form.populate_obj(data)
          db.session.add(data)
          db.session.commit()
          return {"post": data.to_dict_relationship()}
     return form.errors

#Edit a post
@post_routes.route('/<int:postId>',methods=["PUT"])
def update_post(postId):
     form = EditPostForm()
     form['csrf_token'].data = request.cookies['csrf_token']
     if form.validate_on_submit():
          data = Post.query.get(postId)
          form.populate_obj(data)
          db.session.add(data)
          db.session.commit()
          return{"editedPost":data.to_dict_relationship()}
     return form.errors

#Delete a post
@post_routes.route('/<int:postId>',methods=["DELETE"])
def delete_post(postId):
     selected_post = Post.query.get(postId)
     if selected_post:
          db.session.delete(selected_post)
          db.session.commit()
          return{"message": "Post has been removed"}
     return { 'message': "This post does not exist"}

#Get all comments for posts
@post_routes.route('/<int:postId>/comments')
def get_all_comments(postId):
    all_comments = Comment.query.filter(Comment.post_Id == postId)
    return {"Comments": [c.to_dict_comments() for c in all_comments]}




#Create a comment
# /api/posts/:postId/comments
@post_routes.route('/<int:postId>/comments',methods=["POST"])
def create_comment(postId):
     form = CommentForm()
     print("%%%%%%%%%%%%%%%%%Form",form)
     form['csrf_token'].data = request.cookies['csrf_token']
     if form.validate_on_submit():
          user = current_user.to_dict()
          data = Comment(
             user_Id = user['id'],
             post_Id = postId,
             commentText = form.data['commentText']
          )
          db.session.add(data)
          db.session.commit()
          return {"Comment": data.to_dict_comments()}
     return form.errors

  
