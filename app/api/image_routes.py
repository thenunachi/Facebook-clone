# from flask import Blueprint, request, redirect

# from ..models import Post,Comment,db,Image
# from flask_login import current_user

# image_routes = Blueprint('images',__name__)

# @image_routes.route('/<int:imageId>',methods=["DELETE"])
# def deleteImage(imageId):
#      noImage = Image.query.get(imageId)
#      if noImage:
#           db.session.delete(noImage)
#           db.session.commit()
#           return{"message": "Image has been removed"}
#      return { 'message': "This Image does not exist"}
  
