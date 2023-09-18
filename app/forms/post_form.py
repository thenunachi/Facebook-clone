from flask_wtf import FlaskForm
from wtforms import StringField,IntegerField,TextAreaField,SubmitField,FloatField
from wtforms.validators import DataRequired,NumberRange


class PostForm(FlaskForm):
    owner_Id = IntegerField("OwnerId")
    longText = TextAreaField('Write a post',validators =[DataRequired()])
    submit = SubmitField('Add a post')
    image_url = StringField('ImageUrl')

class EditPostForm(FlaskForm):
    owner_Id = IntegerField("OwnerId")
    longText = TextAreaField('Write a post',validators =[DataRequired()])
    submit = SubmitField('Update a post')
    image_url = StringField('ImageUrl')