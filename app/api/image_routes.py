from flask import Blueprint, request, redirect,jsonify  
from app.forms.image_form import EditPostImageForm
from ..models import Post,Comment,db,Image
from flask_login import current_user

image_routes = Blueprint('images',__name__)

# @image_routes.route('/<int:imageId>',methods=["DELETE"])
# def deleteImage(imageId):
#      noImage = Image.query.get(imageId)
#      if noImage:
#           db.session.delete(noImage)
#           db.session.commit()
#           return{"message": "Image has been removed"}
#      return { 'message': "This Image does not exist"}
  
#Edit image

@image_routes.route('/<int:imageId>',methods=["PUT"])
def update_postImage(imageId):
    form = EditPostImageForm()
    print(form,"form%%%%%%%%%")
    image = Image.query.get(imageId)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        
        image.image_url = form.data['image_url']
        image.longText = form.data['longText']
        image.user_Id = form.data['user_Id']
        image.post_Id = form.data['post_Id']        
        db.session.commit()
        print(image,"image%%%%%%%%%")
        # return {"editedImage": image.to_dict_rel()}
        # Return the editedImage as JSON response
        edited_image_dict = image.to_dict_rel()
        return jsonify({"editedImage": edited_image_dict})

    # return form.errors
    return jsonify({"error": "Form validation failed"})  