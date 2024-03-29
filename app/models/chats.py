# from .db import db
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date

class Chat(db.Model):
    __tablename__ = 'chats'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    id = db.Column(db.Integer,nullable=False,primary_key=True)
    sender_Id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    receiver_Id = db.Column(db.Integer,nullable=False)
    message = db.Column(db.String(1000),nullable=False)
    # socketId = db.Column(db.String(500),nullable=False)
    created_at = db.Column(db.Date, default = date.today())
    updated_at = db.Column(db.Date, default = date.today())
    users = db.relationship('User', back_populates ='chats')

    def to_dict_chat(self):
        return{
            "id":self.id,
            "sender_Id":self.sender_Id,
            "receiver_Id":self.receiver_Id,
            "message": self.message,
            # "socketId":self.socketId,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "users":self.users.to_dict()
        }