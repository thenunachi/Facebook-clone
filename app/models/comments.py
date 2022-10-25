from .db import db

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    userId = db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    postId = db.Column(db.Integer,db.ForeignKey('posts.id'),nullable=False)
    commentText = db.Column(db.String(2000), nullable=False)
    users = db.relationship('User',back_populates ='comments')
    posts = db.relationship('Post',back_populates = 'comments')

    def to_dict_comments(self):
        return{
            "id": self.id,
            "userId": self.userId,
            "postId": self.postId,
            "commentText": self.commentText
            }
    def to_dict_rel(self):
        return{
            "id": self.id,
            "userId": self.userId,
            "postId": self.postId,
            "commentText": self.commentText,
            "users": self.users.to_dict(),
            "posts": self.posts.to_dict_post()
            }