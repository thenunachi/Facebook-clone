from app.models.db import db, environment, SCHEMA
from flask.cli import AppGroup
from .users import seed_users, undo_users
from .post import seed_posts,undo_posts
from .comments import seed_comments,undo_comments
from .like import seed_likes,undo_likes
from .image import seed_images,undo_images
# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding, truncate all tables prefixed with schema name
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
        # Add a truncate command here for every table that will be seeded.
        db.session.commit()
    seed_users()
    seed_posts()
    seed_likes()
    seed_comments()
    seed_images()
    # Add other seed functions here




# Creates the `flask seed all` command
# @seed_commands.command('all')
# def seed():
#     seed_users()
#     seed_posts()
#     seed_likes()
#     seed_comments()
#     # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_posts()
    undo_comments()
    undo_likes()
    undo_images()
    # Add other undo functions here
