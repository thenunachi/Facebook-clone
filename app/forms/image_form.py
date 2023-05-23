from logging.config import valid_ident
from flask_wtf import FlaskForm
from wtforms import SubmitField,SelectField,TextAreaField,IntegerField,StringField
# from wtforms.fields import URLField
from wtforms.validators import DataRequired,NumberRange


class ImageForm(FlaskForm):
    user_Id= IntegerField('user_Id')
    post_Id = IntegerField('post_Id')
    image_url = StringField('image_Url',validators =[DataRequired()])
    submit = SubmitField('Add a post')


# class EditCommentForm(FlaskForm):
#     user_Id= IntegerField('owner_Id')
#     post_Id = IntegerField('post_Id')
#     commentText = TextAreaField('Write a comment',validators =[DataRequired()])
#     submit = SubmitField('Add a review')