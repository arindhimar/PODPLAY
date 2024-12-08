from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models here to make them accessible
from models.models import User, Song, Playlist, PlaylistSong
