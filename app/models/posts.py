from .db import db


class Post(db.Model):
    __tablename__ ="posts"
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    owner_Id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    longText = db.Column(db.String(2000),nullable=False)
    # likes = db.Column(db.Integer,nullable=False)
    owner = db.relationship('User',back_populates ='posts')
    comments = db.relationship('Comment', back_populates='posts', cascade='all, delete')
    likes = db.relationship('Like',back_populates ='posts')

    def to_dict_post(self):
        return {
            "id": self.id,
            "owner_Id": self.owner_Id,
            "longText": self.longText,
            # "likes":self.likes
            }

    def to_dict_relationship(self):
        return{
            "id": self.id,
            "owner_Id": self.owner_Id,
            "longText": self.longText,
            # "likes":self.likes,
            "owner": self.owner.to_dict(),
            # "likes": self.likes.to_dict()
        }

