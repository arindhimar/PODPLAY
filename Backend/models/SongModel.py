class SongModel:
    def __init__(self):
        self.conn = self.get_db_connection()

    def get_db_connection(self):
        return mysql.connector.connect(
            host="localhost",
            database="animex",
            user="root",
            password="root"
        )

    def create_song_table_if_not_exists(self):
        create_table_query = """
        CREATE TABLE IF NOT EXISTS songs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(120) NOT NULL,
            artist VARCHAR(120) NOT NULL,
            album VARCHAR(120),
            file_url VARCHAR(300) NOT NULL
        )
        """
        cur = self.conn.cursor()
        cur.execute(create_table_query)
        self.conn.commit()
        cur.close()

    def fetch_song_by_id(self, song_id):
        cur = self.conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM songs WHERE id = %s", (song_id,))
        song = cur.fetchone()
        cur.close()
        return song

    def create_song(self, title, artist, album, file_url):
        cur = self.conn.cursor()
        cur.execute(
            """
            INSERT INTO songs (title, artist, album, file_url)
            VALUES (%s, %s, %s, %s)
            """,
            (title, artist, album, file_url)
        )
        self.conn.commit()
        cur.close()

    def update_song(self, song_id, title=None, artist=None, album=None, file_url=None):
        cur = self.conn.cursor()
        update_fields = []
        values = []
        if title:
            update_fields.append("title = %s")
            values.append(title)
        if artist:
            update_fields.append("artist = %s")
            values.append(artist)
        if album:
            update_fields.append("album = %s")
            values.append(album)
        if file_url:
            update_fields.append("file_url = %s")
            values.append(file_url)

        values.append(song_id)
        update_query = f"UPDATE songs SET {', '.join(update_fields)} WHERE id = %s"
        cur.execute(update_query, tuple(values))
        self.conn.commit()
        cur.close()

    def delete_song(self, song_id):
        cur = self.conn.cursor()
        cur.execute("DELETE FROM songs WHERE id = %s", (song_id,))
        self.conn.commit()
        cur.close()

    def close_connection(self):
        self.conn.close()
