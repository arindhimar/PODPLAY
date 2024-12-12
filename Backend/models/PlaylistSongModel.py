class PlaylistSongModel:
    def __init__(self):
        self.conn = self.get_db_connection()

    def get_db_connection(self):
        return mysql.connector.connect(
            host="localhost",
            database="animex",
            user="root",
            password="root"
        )

    def create_playlist_song_table_if_not_exists(self):
        create_table_query = """
        CREATE TABLE IF NOT EXISTS playlist_songs (
            playlist_id INT,
            song_id INT,
            PRIMARY KEY (playlist_id, song_id),
            FOREIGN KEY (playlist_id) REFERENCES playlists(id),
            FOREIGN KEY (song_id) REFERENCES songs(id)
        )
        """
        cur = self.conn.cursor()
        cur.execute(create_table_query)
        self.conn.commit()
        cur.close()

    def add_song_to_playlist(self, playlist_id, song_id):
        cur = self.conn.cursor()
        cur.execute(
            """
            INSERT INTO playlist_songs (playlist_id, song_id)
            VALUES (%s, %s)
            """,
            (playlist_id, song_id)
        )
        self.conn.commit()
        cur.close()

    def remove_song_from_playlist(self, playlist_id, song_id):
        cur = self.conn.cursor()
        cur.execute(
            "DELETE FROM playlist_songs WHERE playlist_id = %s AND song_id = %s",
            (playlist_id, song_id)
        )
        self.conn.commit()
        cur.close()

    def close_connection(self):
        self.conn.close()
