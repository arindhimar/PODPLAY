from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
import random
import string

sync_blueprint = Blueprint('sync', __name__)
socketio = SocketIO()

rooms = {}

def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@sync_blueprint.route('/create_room', methods=['POST'])
def create_room():
    room_code = generate_room_code()
    rooms[room_code] = {'host': request.sid, 'members': [], 'current_track': None}
    return jsonify({'room_code': room_code})

@socketio.on('join')
def on_join(data):
    room_code = data['room_code']
    if room_code in rooms:
        join_room(room_code)
        rooms[room_code]['members'].append(request.sid)
        emit('room_joined', {'room_code': room_code}, room=room_code)
    else:
        emit('error', {'message': 'Invalid room code'})

@socketio.on('leave')
def on_leave(data):
    room_code = data['room_code']
    if room_code in rooms:
        leave_room(room_code)
        rooms[room_code]['members'].remove(request.sid)
        if len(rooms[room_code]['members']) == 0:
            del rooms[room_code]
        else:
            emit('user_left', {'sid': request.sid}, room=room_code)

@socketio.on('update_track')
def on_update_track(data):
    room_code = data['room_code']
    track = data['track']
    if room_code in rooms:
        rooms[room_code]['current_track'] = track
        emit('track_updated', track, room=room_code)

@socketio.on('play_pause')
def on_play_pause(data):
    room_code = data['room_code']
    is_playing = data['is_playing']
    if room_code in rooms:
        emit('play_pause_updated', {'is_playing': is_playing}, room=room_code)

@socketio.on('seek')
def on_seek(data):
    room_code = data['room_code']
    current_time = data['current_time']
    if room_code in rooms:
        emit('seek_updated', {'current_time': current_time}, room=room_code)

