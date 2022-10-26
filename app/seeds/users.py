from app.models import db, User


# Adds a demo user, you can add other users here if you want
def seed_users():
    print("inside user seed file")
    demo = User(
        username='Demo', email='demo@aa.io', firstname='Demo', lastname='user', password='password')
    marnie = User(
        username='marnie', email='marnie@aa.io', firstname='Marnie', lastname='Pie', password='password')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', firstname='Bobbie', lastname='Hill', password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
