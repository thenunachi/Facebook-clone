from flask import Blueprint, request, redirect
from flask_login import current_user
from sqlalchemy import desc ,asc
from app.forms.comment_form import CommentForm
from app.forms.post_form import EditPostForm, PostForm
from ..models import Post,Comment,db,Like,Image
from app.forms.image_form import ImageForm




post_routes = Blueprint('posts',__name__)

#Get all posts
@post_routes.route('/')
def get_all_posts_and_images():
    all_posts = Post.query.all()
    posts_with_images = []

    for post in all_posts:
        images = Image.query.filter(Image.post_Id == post.id).all()
        post_data = post.to_dict_relationship()
        image_urls = [image.image_url for image in images]
        if image_urls:
          post_data['image_url'] = image_urls[0] 
        posts_with_images.append(post_data)
        print(posts_with_images,"imagesPPP")
    return {'posts_with_images': posts_with_images}




# Get post by ownerId
@post_routes.route('/<int:ownerId>')
def get_posts_by_ownerId(ownerId):
    posts = Post.query.filter(ownerId == Post.owner_Id).order_by(desc(Post.id))
    posts_with_images = []

    for post in posts:
        images = Image.query.filter(Image.post_Id == post.id).all()
        post_data = post.to_dict_relationship()
        image_urls = [image.image_url for image in images]
        post_data['image_urls'] = image_urls[0]  # Store all image URLs in the post_data
        posts_with_images.append(post_data)

    return {'posts_with_images': posts_with_images}




#Create a post
@post_routes.route('/',methods=["POST"])
def create_post():
    form = PostForm()  # Calling form
    user = current_user.to_dict()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = Post(
            owner_Id=user['id'],
            longText=form.data['longText']
        )

        db.session.add(data)
        db.session.commit()
        print(data, "datala")
        post = Post.query.get(data.id)

        # Call the createImage function to get the inner dictionary
        image_data = createImage(post.id)

        return image_data  # Return the inner dictionary directly

    return form.errors

def createImage(postId):
    user = current_user.to_dict()
    form = ImageForm()
    data = Image(
        user_Id=user['id'],
        post_Id=postId,
        image_url=form.data['image_url']
    )
    db.session.add(data)
    db.session.commit()
    return {'images': data.to_dict_rel()}






# def create_post():
#      form = PostForm() #calling form
#      user = current_user.to_dict()
#      form['csrf_token'].data = request.cookies['csrf_token']
#      if form.validate_on_submit():
#           data = Post(
               
#                owner_Id = user['id'],
#                longText =form.data['longText']
#           ) 
          
#           db.session.add(data)
#           db.session.commit()
#           print(data,"datala")
#           post = Post.query.get(data.id) 
         

#           def createImage(postId):
#                user = current_user.to_dict()
#                form = ImageForm()
#                data = Image(
#                     user_Id = user['id'],
#                     post_Id = postId,
#                     image_url = form.data['image_url']
#                )
#                #     print(data,"data from image Def %%%%%%%%%%%%%%%%%%%%%%%%%%")
#                db.session.add(data)
#                db.session.commit()
#                return {'images': data.to_dict_rel()}
#           return {
#           'post': data.to_dict_relationship()
#           # 'image': data.to_dict_rel()
#            }
#      return form.errors

@post_routes.route('/<int:postId>',methods=["PUT"])
def update_post(postId):
     """Edit a post"""
     form = EditPostForm()
     # post = Post.query.get(postId)
     form['csrf_token'].data = request.cookies['csrf_token']
     if form.validate_on_submit():
          # print('Update img data' + str(form.data))
          data = Post.query.get(postId)
          #form.populate_obj(data)
          data.longText = form.data['longText']
          image_data = Image(
               user_Id = data.owner_Id,
               post_Id = postId,
               image_url = form.data['image_url']
          )
          db.session.add(image_data)
          db.session.add(data)
          db.session.commit()
          return{"editedPost":data.to_dict_relationship()}
     return form.errors

#Delete a post
@post_routes.route('/<int:postId>',methods=["DELETE"])
def delete_post(postId):
     selected_post = Post.query.get(postId)
     noImage = Image.query.get(postId)
     if selected_post:
          db.session.delete(selected_post)
          db.session.commit()
          return{"message": "Post has been removed"}
     if noImage:
          db.session.delete(noImage)
          db.session.commit()
          return{"message": "Image has been removed"}
     return { 'message': "This post and image does not exist"}
     
    







#Get all comments for posts
@post_routes.route('/<int:postId>/comments')
def get_all_comments(postId):
     #query.order_by(SpreadsheetCells.y_index.desc()) 
    all_comments = Comment.query.filter(Comment.post_Id == postId).order_by(desc(Comment.id))
#     print(all_comments,"all_comments^^^^^^^^^^^^^^^^^^^^^^^^^^")
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

@post_routes.route('/<int:postId>/likes')
def get_all_likes_perPost(postId):
     likes = Like.query.filter(Like.post_Id == postId)
     # print(likes,"likes ######")
     # print(likes.count(),"****************************************************")
     return {"likes": [ l.to_dict() for l in likes]}
     



@post_routes.route('/<int:postId>/likes',methods=["POST"])
def setLike(postId):
    user = current_user.to_dict()
    data = Like(
        user_Id = user['id'],
        post_Id = postId
    )
    db.session.add(data)
    db.session.commit()
    return {'likes': data.to_dict()}


@post_routes.route('/<int:postId>/images')
def get_all_images_perPost(postId):
     images = Image.query.filter(Image.post_Id == postId)
     # print(images,"all images ######")
     # print(likes.count(),"****************************************************")
     return {"images": [ l.to_dict_rel() for l in images]}




