from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from controllers.song_controller import song_blueprint
from controllers.sync_controller import sync_blueprint, socketio


app = Flask(__name__)
CORS(app)  
socketio.init_app(app, cors_allowed_origins="*")

# Register Blueprints
app.register_blueprint(song_blueprint, url_prefix='/songs')
app.register_blueprint(sync_blueprint, url_prefix='/sync')
    
if __name__ == "__main__":
    app.run(debug=True)
