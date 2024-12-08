from app import db

# User Model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    playlists = db.relationship('Playlist', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"

# Song Model
class Song(db.Model):
    __tablename__ = 'songs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    artist = db.Column(db.String(120), nullable=False)
    album = db.Column(db.String(120), nullable=True)
    file_url = db.Column(db.String(300), nullable=False)
    playlists = db.relationship('PlaylistSong', back_populates='song')

    def __repr__(self):
        return f"<Song {self.title} by {self.artist}>"

# Playlist Model
class Playlist(db.Model):
    __tablename__ = 'playlists'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    songs = db.relationship('PlaylistSong', back_populates='playlist')

    # Enforce unique playlist names for each user
    __table_args__ = (db.UniqueConstraint('name', 'user_id', name='uix_1'),)

    def __repr__(self):
        return f"<Playlist {self.name}>"

# Association Table for Playlists and Songs
class PlaylistSong(db.Model):
    __tablename__ = 'playlist_songs'
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'), primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'), primary_key=True)
    playlist = db.relationship('Playlist', back_populates='songs')
    song = db.relationship('Song', back_populates='playlists')

    def __repr__(self):
        return f"<PlaylistSong playlist_id={self.playlist_id}, song_id={self.song_id}>"
