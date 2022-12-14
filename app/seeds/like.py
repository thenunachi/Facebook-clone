from app.models import db,Like

def seed_likes():
    like1 = Like(
        # count = 7,
        user_Id = 1,
        post_Id=2
    )
    like2 = Like(
        # count =74,
        user_Id=2,
        post_Id=1
    )
    like3 = Like(
        # count=75,
        user_Id=1,
        post_Id=2
    )
    like4 = Like(
        # -count=67,
        user_Id=1,
        post_Id=2
    )

    db.session.add(like1)
    db.session.add(like2)
    db.session.add(like3)
    db.session.add(like4)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_likes():
    db.session.execute('TRUNCATE likes RESTART IDENTITY CASCADE;')
    db.session.commit()
