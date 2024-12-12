import mysql.connector

class UserModel:
    def __init__(self):
        self.conn = self.get_db_connection()

    def get_db_connection(self):
        return mysql.connector.connect(
            host="localhost",
            database="animex",
            user="root",
            password="root"
        )

    def create_user_table_if_not_exists(self):
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(80) UNIQUE NOT NULL,
            email VARCHAR(120) UNIQUE NOT NULL,
            password VARCHAR(200) NOT NULL
        )
        """
        cur = self.conn.cursor()
        cur.execute(create_table_query)
        self.conn.commit()
        cur.close()

    def fetch_user_by_id(self, user_id):
        cur = self.conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        cur.close()
        return user

    def fetch_user_by_username(self, username):
        cur = self.conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        cur.close()
        return user

    def create_user(self, username, email, password):
        cur = self.conn.cursor()
        cur.execute(
            """
            INSERT INTO users (username, email, password)
            VALUES (%s, %s, %s)
            """,
            (username, email, password)
        )
        self.conn.commit()
        cur.close()

    def update_user(self, user_id, username=None, email=None, password=None):
        cur = self.conn.cursor()
        update_fields = []
        values = []
        if username:
            update_fields.append("username = %s")
            values.append(username)
        if email:
            update_fields.append("email = %s")
            values.append(email)
        if password:
            update_fields.append("password = %s")
            values.append(password)

        values.append(user_id)
        update_query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s"
        cur.execute(update_query, tuple(values))
        self.conn.commit()
        cur.close()

    def delete_user(self, user_id):
        cur = self.conn.cursor()
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        self.conn.commit()
        cur.close()

    def close_connection(self):
        self.conn.close()
