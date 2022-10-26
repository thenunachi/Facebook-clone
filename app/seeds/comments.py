from app.models import db, Comment

def seed_comments():
    comment1 = Comment(
        user_Id = 1,
        post_Id = 1,
        commentText = "Yeah I like Texas too"
    )
    comment2 = Comment(
        user_Id = 2,
        post_Id = 1,
        commentText = "The weather today is pleasent"
    )
    comment3 = Comment(
        user_Id = 2,
        post_Id = 2,
        commentText = "The temperature was too high today"
    )
    comment4 = Comment(
        user_Id = 3,
        post_Id = 2,
        commentText = "I saw weather for next week. We might have heat waves"
    )


    db.session.add(comment1)
    db.session.add(comment2)
    db.session.add(comment3)
    db.session.add(comment4)
    db.session.commit()

def undo_comments():
    db.session.execute('TRUNCATE comments RESTART IDENTITY CASCADE;')
    db.session.commit()
