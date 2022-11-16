from email import message
from logging.config import valid_ident
from flask_wtf import FlaskForm
from wtforms import SubmitField,SelectField,TextAreaField,IntegerField
from wtforms.validators import DataRequired,NumberRange

class ChatForm(FlaskForm):
    sender_Id = IntegerField('user_Id')
    # receiver_Id = IntegerField('user_Id')
    message = TextAreaField('Lets chat !!',)
    submit = SubmitField('submit')
