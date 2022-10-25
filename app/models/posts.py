from .db import db

# class Product(db.Model):
#     __tablename__ = "products"
#     id = db.Column(db.Integer, nullable=False, primary_key=True)
#     owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     name = db.Column(db.String(255), nullable=False)
#     description = db.Column(db.String(255), nullable=False)
#     price = db.Column(db.Float, nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)
#     owner = db.relationship('User', back_populates = 'products')
#     images = db.relationship('Image', back_populates ='products')
#     reviews = db.relationship('Review', back_populates = 'products')
#     carts = db.relationship("Cart", back_populates="products", cascade='all, delete')

class Post(db.Model):
    __tablename__ ="posts"
    id = db.Column(db.Integer,nullable=False,primary_key=True)
    ownerId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    longText = db.Column(db.String(255),nullable=False)
    owner = db.relationship('User',back_populates = 'posts')
    comment = db.relationship('Comment',back_populates = 'posts')


    def to_dict_post(self):
        return {
            "id": self.id,
            "ownerId": self.ownerId,
            "longText": self.longText
            }

    def to_dict_relationship(self):
        return{
            "id": self.id,
            "ownerId": self.ownerId,
            "longText": self.longText,
            "owner": self.owner.to_dict(),
            "comment": [c.to_dict_comments() for c in self.comments]
        }

