from app.models import db, Post


# Adds a demo user, you can add other users here if you want
def seed_posts():
    post1 = Post(
        owner_Id = 1,
        longText = 'Today was a pleasent day in Texas.Feeling happy',
        
    )
    post2 = Post(
        owner_Id = 2,
        longText = 'I hate this summer.It is so hot.',
        
    )
    post3 = Post(
        owner_Id = 1,
        longText = 'I like icecream from costco.They have huge variety of icecreams',
     
    )
    post4 = Post(
        owner_Id = 3,
        longText = 'I went on a ride in Testla',
         
    )

    db.session.add(post1)
    db.session.add(post2)
    db.session.add(post3)
    db.session.add(post4)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_posts():
    db.session.execute('TRUNCATE posts RESTART IDENTITY CASCADE;')
    db.session.commit()
