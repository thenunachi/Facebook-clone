from flask import Blueprint, request, redirect
from app.forms.comment_form import CommentForm
from sqlalchemy import desc 
from app.forms.post_form import EditPostForm, PostForm
from ..models import Post,Comment,db
from flask_login import current_user

post_routes = Blueprint('posts',__name__)

#Get all posts
@post_routes.route('/')
def get_all_posts():
     all_posts = Post.query.all()
     # print("******************************POST", all_posts)
     return {'posts':[p.to_dict_relationship() for p in all_posts]}



# Get post by ownerId
@post_routes.route('/<int:ownerId>')
def get_posts_by_ownerId(ownerId):
     posts = Post.query.filter(ownerId == Post.owner_Id)
     # print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& one_post",posts)
     # return {"Reviews": [review.to_dict_reviews() for review in products_reviews]}
     # print({'posts' : [post.to_dict_post()for post in posts]},"**********************DATA from backend")#{'posts': [{'id': 1, 'owner_Id': 1, 'longText': 'Today was a pleasent day in Texas.Feeling happy'}, {'id': 3, 'owner_Id': 1, 'longText': 'I like icecream from costco.They have huge variety of icecreams'}]}
     return {'posts' : [post.to_dict_relationship()for post in posts]}

#Create a post
@post_routes.route('/',methods=["POST"])
def create_post():
     form = PostForm() #calling form
     user = current_user.to_dict()
     form['csrf_token'].data = request.cookies['csrf_token']
     if form.validate_on_submit():
          data = Post(
               owner_Id = user['id'],
               longText =form.data['longText']

          ) #assigning model
         # form.populate_obj(data)
          db.session.add(data)
          db.session.commit()
          return {"post": data.to_dict_relationship()}
     return form.errors

#Edit a post
@post_routes.route('/<int:postId>',methods=["PUT"])
def update_post(postId):
     form = EditPostForm()
     # post = Post.query.get(postId)
     form['csrf_token'].data = request.cookies['csrf_token']
     if form.validate_on_submit():
          data = Post.query.get(postId)
          #form.populate_obj(data)
          data.longText = form.data['longText']
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
    all_comments = Comment.query.filter(Comment.post_Id == postId).order_by(desc(Comment.id))
    print(all_comments,"all_comments^^^^^^^^^^^^^^^^^^^^^^^^^^")
    return {"Comments": [c.to_dict_rel() for c in all_comments]}




#Create a comment
# /api/posts/:postId/comments
@post_routes.route('/<int:postId>/comments',methods=["POST"])
def create_comment(postId):
     form = CommentForm()
     user = current_user.to_dict()
     print("%%%%%%%%%%%%%%%%%Form",form)
     form['csrf_token'].data = request.cookies['csrf_token']
     if form.validate_on_submit():
       
          data = Comment(
             user_Id = user['id'],
             post_Id = postId,
             commentText = form.data['commentText']
          )
          db.session.add(data)
          db.session.commit()
          return {"Comment": data.to_dict_comments()}
     return form.errors

  
