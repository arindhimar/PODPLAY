from flask import Blueprint, request, jsonify
from flask_socketio import emit, join_room, leave_room
from flask_cors import cross_origin
import random
import string

sync_controller = Blueprint('sync_controller', __name__)

rooms = {}

def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@sync_controller.route('/create_room', methods=['POST'])
def create_room():
    room_code = generate_room_code()
    rooms[room_code] = {
        'host': request.json.get('user_id'),
        'members': [],
        'current_track': None,
        'is_playing': False,
        'current_position': 0
    }
    return jsonify({'room_code': room_code}), 200

@sync_controller.route('/join_room', methods=['POST'])
def join_room_route():
    room_code = request.json.get('room_code')
    user_id = request.json.get('user_id')
    
    if room_code not in rooms:
        return jsonify({'error': 'Room not found'}), 404
    
    rooms[room_code]['members'].append(user_id)
    return jsonify({'message': 'Joined room successfully'}), 200

@sync_controller.route('/update_playback', methods=['POST'])
@cross_origin()
def update_playback():
    data = request.json
    # Process the data and update the playback state
    # This is where you'd interact with your database or state management system
    return jsonify({"status": "success", "message": "Playback updated"}), 200

def init_app(app, socketio):
    app.register_blueprint(sync_controller)

    @socketio.on('connect')
    def handle_connect():
        print('Client connected')

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')

    @socketio.on('join')
    def on_join(data):
        room = data['room']
        join_room(room)
        emit('user_joined', {'user': request.sid}, room=room)
        print(f'User {request.sid} joined room {room}')
        # Send current room state to the new user
        if room in rooms:
            emit('sync_playback', rooms[room], room=request.sid)

    @socketio.on('leave')
    def on_leave(data):
        room = data['room']
        leave_room(room)
        emit('user_left', {'user': request.sid}, room=room)
        print(f'User {request.sid} left room {room}')

    @socketio.on('update_playback')
    def handle_update_playback(data):
        room_code = data['room']
        if room_code in rooms:
            rooms[room_code].update({
                'current_track': data.get('current_track'),
                'is_playing': data.get('is_playing'),
                'current_position': data.get('current_position')
            })
            emit('playback_updated', rooms[room_code], room=room_code, include_self=True)
            print(f'Playback updated in room {room_code}')

    @socketio.on('request_sync')
    def handle_request_sync(data):
        room_code = data['room']
        if room_code in rooms:
            emit('sync_playback', rooms[room_code], room=room_code, include_self=True)
            print(f'Sync requested in room {room_code}')

    @socketio.on('seek')
    def handle_seek(data):
        room_code = data['room']
        if room_code in rooms:
            rooms[room_code]['current_position'] = data['position']
            emit('seek', {'position': data['position']}, room=room_code, include_self=False)
            print(f'Seek performed in room {room_code}')

