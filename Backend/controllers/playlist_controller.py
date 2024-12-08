from flask import request, jsonify, Blueprint
from models import Playlist, Music, db
from flask_login import login_required

playlist_blueprint = Blueprint('playlist', __name__, url_prefix='/api/playlists')

@playlist_blueprint.route('/', methods=['GET'])
@login_required
def get_all_playlists():
    """
    Retrieve all playlists.
    
    Returns:
    JSON: A list of all playlists with relevant details.
    """
    playlists = Playlist.query.all()
    return jsonify([
        {
            'id': playlist.id,
            'name': playlist.name,
            'songs': [{'id': song.id, 'title': song.title} for song in playlist.songs]
        } for playlist in playlists
    ]), 200

@playlist_blueprint.route('/<int:playlist_id>', methods=['GET'])
@login_required
def get_playlist(playlist_id):
    """
    Retrieve a specific playlist by ID.
    
    Args:
    playlist_id: ID of the playlist to retrieve.
    
    Returns:
    JSON: Details of the specified playlist or an error message.
    """
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    return jsonify({
        'id': playlist.id,
        'name': playlist.name,
        'songs': [{'id': song.id, 'title': song.title} for song in playlist.songs]
    }), 200

@playlist_blueprint.route('/', methods=['POST'])
@login_required
def create_playlist():
    """
    Create a new playlist.
    
    Returns:
    JSON: A success message or error details.
    """
    data = request.json
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    
    new_playlist = Playlist(name=name)
    db.session.add(new_playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist created successfully', 'playlist_id': new_playlist.id}), 201

@playlist_blueprint.route('/<int:playlist_id>/add-song', methods=['POST'])
@login_required
def add_song_to_playlist(playlist_id):
    """
    Add a song to a playlist.
    
    Args:
    playlist_id: ID of the playlist to add a song to.
    
    Returns:
    JSON: A success message or error details.
    """
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    
    data = request.json
    song_id = data.get('song_id')
    song = Music.query.get(song_id)
    if not song:
        return jsonify({'error': 'Song not found'}), 404
    
    playlist.songs.append(song)
    db.session.commit()
    return jsonify({'message': 'Song added to playlist successfully'}), 200
