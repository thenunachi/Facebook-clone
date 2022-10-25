from logging.config import valid_ident
from flask_wtf import FlaskForm
from wtforms import SubmitField,SelectField,TextAreaField,IntegerField
from wtforms.validators import DataRequired,NumberRange


class CommentForm(FlaskForm):
    userId= IntegerField('ownerId')
    postId = IntegerField('postId')
    commentText = TextAreaField('Write a comment',validators =[DataRequired()])
    submit = SubmitField('Add a review')


class EditCommentForm(FlaskForm):
    userId= IntegerField('ownerId')
    postId = IntegerField('postId')
    commentText = TextAreaField('Write a comment',validators =[DataRequired()])
    submit = SubmitField('Add a review')
