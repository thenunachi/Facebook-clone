from .db import db

class Like(db.Model):
    __tablename__="likes"
    id = db.Column(db.Integer,nullable=False,primary_key=True)
    # count = db.Column(db.Integer,nullable=False)
    user_Id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    post_Id = db.Column(db.Integer,db.ForeignKey('posts.id'),nullable=False)
    posts = db.relationship('Post',back_populates='likes')
    user = db.relationship('User',back_populates='likes')
    
    def to_dict(self):
        return{
            "id": self.id,
            # "count":self.count,
            "user_Id": self.user_Id,
            "post_Id": self.post_Id, 
            "user": self.user.to_dict(),
            "posts": self.posts.to_dict_post()
        }