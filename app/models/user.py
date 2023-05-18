# from .db import db
from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    firstname = db.Column(db.String(40), nullable=False)
    lastname = db.Column(db.String(40), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    posts = db.relationship('Post', back_populates='owner', cascade='all, delete')
    comments = db.relationship('Comment', back_populates='users', cascade='all, delete')
    chats = db.relationship('Chat', back_populates ='users',cascade='all,delete')
    likes = db.relationship('Like',back_populates ='user')
    images = db.relationship('Image',back_populates = 'user')
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstname': self.firstname,
            'lastname': self.lastname
        }
    def to_dict_user_rel(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstname': self.firstname,
            'lastname': self.lastname,
            'posts': [p.to_dict_post() for p in self.posts],
            'comments':[c.to_dict_comments() for c in self.comments],
            # "likes": self.to_dict_like()
        }