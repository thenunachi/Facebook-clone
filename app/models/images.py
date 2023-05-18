from .db import db, environment, SCHEMA, add_prefix_for_prod

class Image(db.Model):
    __tablename__ = 'images'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    user_Id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod('users.id')),nullable=False)
    post_Id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod('posts.id')),nullable=False)
    image_url = db.Column(db.String, nullable=False)
    user = db.relationship('User',back_populates ='images')
    posts = db.relationship('Post',back_populates = 'images')
    

    def to_dict_rel(self):
        return{
            "id": self.id,
            "user_Id": self.user_Id,
            "post_Id": self.post_Id,
            "image_url": self.image_url,
            "users": self.user.to_dict(),
            "posts": self.posts.to_dict_post()
            }