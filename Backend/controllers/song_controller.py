from flask import Blueprint, request, jsonify
import requests
import logging

# Initialize Blueprint
song_blueprint = Blueprint('song_blueprint', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Define base URL for the Saavn API
BASE_URL = "http://localhost:3000"


# Search Songs by query (Updated to match '/songs/search')
@song_blueprint.route('/search', methods=['GET'])
def search_songs():
    query = request.args.get('query')
    

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Prepare query parameters
    params = {"query": query}

    try:
        logging.info(f"Searching songs for query: {query}")
        response = requests.get(f"{BASE_URL}/api/search/songs", params=params)
        response.raise_for_status()

        data = response.json()
        if data.get('success') and 'data' in data and 'results' in data['data']:
            songs = [
                {
                    "id": item.get("id"),
                    "title": item.get("name"),
                    "album": item.get("album", {}).get("name", "Unknown Album"),
                    "image": item.get("image"),
                    "url": item.get("url"),
                    "artist": ", ".join([artist['name'] for artist in item.get('artists', {}).get('primary', [])]),
                    "audio_url": item.get("downloadUrl", [{}])[-1].get("url", ""),
                    "release_date": item.get("release_date", "Unknown Date"),
                    "duration": item.get("duration", "Unknown Duration"),
                    "language": item.get("language", "Unknown Language"),
                    "play_count": item.get("play_count", "Unknown Count"),
                    "lyrics_available": item.get("lyrics_available", False),
                }
                for item in data['data']['results']
            ]
            return jsonify(songs)
        else:
            logging.warning("Invalid API response structure")
            return jsonify({"error": "Unexpected API response format"}), 500

    except requests.exceptions.RequestException as e:
        logging.error(f"API request failed: {str(e)}")
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Retrieve Song by ID (Similar to '/songs/{id}')
@song_blueprint.route('/songs/<song_id>', methods=['GET'])
def get_song_by_id(song_id):
    lyrics = request.args.get('lyrics', 'false').lower() == 'true'

    try:
        logging.info(f"Fetching song details for ID: {song_id}")
        response = requests.get(f"{BASE_URL}/songs/{song_id}")
        response.raise_for_status()

        data = response.json()
        if data.get('success') and 'data' in data:
            song = {
                "id": data['data']['id'],
                "title": data['data']['name'],
                "album": data['data'].get('album', {}).get('name', 'Unknown Album'),
                "artist": ", ".join([artist['name'] for artist in data['data']['artists']['primary']]),
                "image": data['data']['image'],
                "release_date": data['data'].get('release_date', 'Unknown Date'),
                "audio_url": data['data'].get("downloadUrl", [{}])[-1].get("url", ""),
                "lyrics": data['data'].get('lyrics', 'No lyrics available') if lyrics else None
            }
            return jsonify(song)
        else:
            logging.warning("Invalid API response structure")
            return jsonify({"error": "Song not found"}), 404

    except requests.exceptions.RequestException as e:
        logging.error(f"API request failed: {str(e)}")
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Retrieve Song Lyrics (Similar to '/songs/{id}/lyrics')
@song_blueprint.route('/songs/<song_id>/lyrics', methods=['GET'])
def get_song_lyrics(song_id):
    try:
        logging.info(f"Fetching lyrics for song ID: {song_id}")
        response = requests.get(f"{BASE_URL}/api/songs/{song_id}/lyrics")
        response.raise_for_status()

        data = response.json()
        if data.get('success') and 'data' in data:
            return jsonify({
                "id": song_id,
                "lyrics": data['data']
            })
        else:
            logging.warning("No lyrics found for the song")
            return jsonify({"error": "Lyrics not found for the given song ID"}), 404

    except requests.exceptions.RequestException as e:
        logging.error(f"API request failed: {str(e)}")
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500



@song_blueprint.route('/suggestions', methods=['GET'])
def get_song_suggestions():
    song_id = request.args.get('song_id')
    limit = request.args.get('limit', 10)
    if not song_id:
        return jsonify({"error": "song_id parameter is required"}), 400

    try:
        logging.info(f"Fetching song suggestions for song ID: {song_id}")
        response = requests.get(f"{BASE_URL}/api/songs/{song_id}/suggestions", params={"limit": limit})
        response.raise_for_status()

        data = response.json()
        if data.get('success') and 'data' in data:
            suggestions = [
                {
                    "id": item['id'],
                    "title": item['name'],
                    "album": item.get("album", {}).get("name", "Unknown Album"),
                    "artist": ", ".join([artist['name'] for artist in item.get('artists', {}).get('primary', [])]),
                    "url": item['url'],
                    "audio_url": item.get("downloadUrl", [{}])[-1].get("url", ""),
                    "image":item.get("image")
                }
                for item in data['data']
            ]
            return jsonify(suggestions)
        else:
            logging.warning("Invalid API response structure")
            return jsonify({"error": "No song suggestions found"}), 404

    except requests.exceptions.RequestException as e:
        logging.error(f"API request failed: {str(e)}")
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
