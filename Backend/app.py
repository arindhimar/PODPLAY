from flask import Flask, render_template
from controllers.song_controller import song_blueprint  
import os
from flask_cors import CORS  # Import CORS



app = Flask(__name__)
CORS(app)  

# Register Blueprints
app.register_blueprint(song_blueprint, url_prefix='/songs')

if __name__ == "__main__":
    app.run(debug=True)
