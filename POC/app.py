from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

# Endpoint to search for songs
@app.route('/search', methods=['GET'])
def search_songs():
    query = request.args.get('query')
    
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    # Saavn API endpoint
    BASE_URL = "https://saavn.dev/api/search/songs"
    
    # Prepare query parameters
    params = {
        "query": query
    }

    try:
        # Make a request to the Saavn API
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()  # Will raise an exception for HTTP error responses
        
        # Parse the response as JSON
        data = response.json()
        
        # Check if the response contains song data
        if 'success' in data and data['success'] and 'data' in data and 'results' in data['data']:
            songs = []
            for item in data['data']['results']:
                songs.append({
                    "id": item.get("id"),
                    "title": item.get("name"),
                    "image": item.get("image", [{}])[0].get("url", ""),  # Get first image URL if available
                    "url": item.get("url"),
                    "artist": ", ".join([artist['name'] for artist in item.get('artists', {}).get('primary', [])]),
                    "audio_url": item.get("downloadUrl", [{}])[0].get("url", "")
                })
            return jsonify(songs)
        else:
            return jsonify({"error": "No songs found"}), 404
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
