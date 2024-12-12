class PlaylistModel:
    def __init__(self):
        self.conn = self.get_db_connection()

    def get_db_connection(self):
        return mysql.connector.connect(
            host="localhost",
            database="animex",
            user="root",
            password="root"
        )

    def create_playlist_table_if_not_exists(self):
        create_table_query = """
        CREATE TABLE IF NOT EXISTS playlists (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        """
        cur = self.conn.cursor()
        cur.execute(create_table_query)
        self.conn.commit()
        cur.close()

    def fetch_playlist_by_id(self, playlist_id):
        cur = self.conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM playlists WHERE id = %s", (playlist_id,))
        playlist = cur.fetchone()
        cur.close()
        return playlist

    def create_playlist(self, name, user_id):
        cur = self.conn.cursor()
        cur.execute(
            """
            INSERT INTO playlists (name, user_id)
            VALUES (%s, %s)
            """,
            (name, user_id)
        )
        self.conn.commit()
        cur.close()

    def update_playlist(self, playlist_id, name=None):
        cur = self.conn.cursor()
        if name:
            cur.execute("UPDATE playlists SET name = %s WHERE id = %s", (name, playlist_id))
        self.conn.commit()
        cur.close()

    def delete_playlist(self, playlist_id):
        cur = self.conn.cursor()
        cur.execute("DELETE FROM playlists WHERE id = %s", (playlist_id,))
        self.conn.commit()
        cur.close()

    def close_connection(self):
        self.conn.close()
