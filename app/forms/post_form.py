from flask_wtf import FlaskForm
from wtforms import StringField,IntegerField,TextAreaField,SubmitField,FloatField
from wtforms.validators import DataRequired,NumberRange


class PostForm(FlaskForm):
    ownerId = IntegerField("OwnerId")
    posts = TextAreaField('Write a post',validators =[DataRequired()])
    submit = SubmitField('Add a post')

class EditPostForm(FlaskForm):
    ownerId = IntegerField("OwnerId")
    posts = TextAreaField('Write a post',validators =[DataRequired()])
    submit = SubmitField('Update a post')