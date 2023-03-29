# from .db import db
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Comment(db.Model):
    __tablename__ = 'comments'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_Id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    post_Id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod('posts.id')),nullable=False)
    commentText = db.Column(db.String(2000), nullable=False)
    users = db.relationship('User',back_populates ='comments')
    posts = db.relationship('Post',back_populates = 'comments')

    def to_dict_comments(self):
        return{
            "id": self.id,
            "user_Id": self.user_Id,
            "post_Id": self.post_Id,
            "commentText": self.commentText
            }
    def to_dict_rel(self):
        return{
            "id": self.id,
            "user_Id": self.user_Id,
            "post_Id": self.post_Id,
            "commentText": self.commentText,
            "users": self.users.to_dict(),
            # "posts": self.posts.to_dict_post()
            }