from flask import Blueprint, request, redirect
from app.forms.comment_form import EditCommentForm

from app.forms.post_form import EditPostForm, PostForm
from ..models import Post,Comment,db
from flask_login import current_user

comment_routes = Blueprint('comments',__name__)

# #Get comments for users
# @review_routes.route('/user')
# def get_all_comments_user():
#     if current_user.is_authenticated:
#         user = current_user.to_dict()
#         all_reviews = Review.query.filter(Review.user_id == user['id'])
#         return {"Reviews": [review.to_dict_reviews() for review in all_reviews]}
#     return "No User Logged In"
#Get comments for users ????????????????
@comment_routes.route('/user')
def get_all_comments():
    if current_user.is_authenticated:
        user = current_user.to_dict()
        all_comments = Comment.query.filter(user['id'] == Comment.user_Id)
        return {"Comments": [c.to_dict_comments() for c in all_comments]}
    return "No User Logged In"

#Edit comment

@comment_routes.route('/<int:commentId>',methods=["PUT"])
def update_comment(commentId):
    form = EditCommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = Comment.query.get(commentId)
        form.populate_obj(data)
        db.session.add(data)
        db.session.commit()
        return {"EditedComment": data.to_dict_comments()}
    return form.errors

#Delete a comment
# /api/comments/:comments_id
@comment_routes.route('/<int:commentId>',methods=["DELETE"])
def delete_comment(commentId):
     selected_comment = Comment.query.get(commentId)
     if selected_comment:
          db.session.delete(selected_comment)
          db.session.commit()
          return{"message": "Comment has been removed"}
     return { 'message': "This Comment does not exist"}