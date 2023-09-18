from app.models import db,Image

def seed_images():
    images1 = Image(
    
        user_Id = 1,
        post_Id=1,
        image_url = 'https://images.unsplash.com/photo-1615811296323-92323c54395a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=378&q=80'
    )
    images2 = Image(
        
        user_Id=2,
        post_Id=2,
        image_url = 'https://images.unsplash.com/photo-1532347922424-c652d9b7208e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fHN1bW1lciUyMGhvdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60'
    )
    images3 = Image(
     
        user_Id=1,
        post_Id=3,
        image_url = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHN1bW1lciUyMGhvdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60'
    )
    images4 = Image(
      
        user_Id=3,
        post_Id=4,
        image_url = 'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80'
    )

    db.session.add(images1)
    db.session.add(images2)
    db.session.add(images3)
    db.session.add(images4)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_images():
    db.session.execute('TRUNCATE likes RESTART IDENTITY CASCADE;')
    db.session.commit()