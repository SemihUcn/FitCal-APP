from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import bcrypt

# Flask uygulaması başlatma
app = Flask(__name__)
CORS(app)

# Veritabanı bağlantı bilgileri
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "12345",
    "database": "app_db"
}

# Veritabanına bağlanma fonksiyonu
def get_db_connection():
    return pymysql.connect(
        host=db_config["host"],
        user=db_config["user"],
        password=db_config["password"],
        database=db_config["database"],
        cursorclass=pymysql.cursors.DictCursor
    )

# Kullanıcı kayıt endpoint'i
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    name = data.get("name")
    surname = data.get("surname")
    email = data.get("email")
    password = data.get("password")
    weight = data.get("weight")
    height = data.get("height")
    age = data.get("age")
    gender = data.get("gender")

    # Şifreyi hashleme
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                INSERT INTO users (name, surname, email, password, weight, height, age, gender)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (name, surname, email, hashed_password, weight, height, age, gender))
            connection.commit()
        return jsonify({"message": "User registered successfully"}), 200
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Kullanıcı giriş endpoint'i
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = "SELECT id, password FROM users WHERE email = %s"
            cursor.execute(query, (email,))
            user = cursor.fetchone()

            if user and bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
                return jsonify({"message": "Login successful", "user_id": user["id"]}), 200
            else:
                return jsonify({"error": "Invalid email or password"}), 401
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()



@app.route('/api/save_survey', methods=['POST'])
def save_survey():
    data = request.json
    user_id = data.get("user_id")
    daily_activity = data.get("daily_activity")
    dietary_preference = data.get("dietary_preference")
    target_weight = data.get("target_weight")
    exercise_frequency = data.get("exercise_frequency")

    if not user_id or not daily_activity or not dietary_preference or not target_weight or not exercise_frequency:
        return jsonify({"error": "Eksik veri"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                UPDATE users
                SET daily_activity = %s, dietary_preference = %s, target_weight = %s, exercise_frequency = %s
                WHERE id = %s
            """
            cursor.execute(query, (daily_activity, dietary_preference, target_weight, exercise_frequency, user_id))
            connection.commit()
        return jsonify({"message": "Survey updated successfully"}), 200
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()



# Kullanıcı profil detaylarını alma endpoint'i
@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                SELECT email, CONCAT(name, ' ', surname) AS full_name, height, weight, gender
                FROM users
                WHERE id = %s
            """
            cursor.execute(query, (user_id,))
            user = cursor.fetchone()
            
            if user:
                return jsonify(user), 200
            else:
                return jsonify({"error": "User not found"}), 404
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()



# Fetch all comments with like status for the current user
@app.route('/api/comments', methods=['GET'])
def get_comments():
    user_id = request.args.get('user_id')  # Pass the user_id as a query parameter

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            query = """
                SELECT 
                    comments.id AS comment_id,
                    CONCAT(users.name, ' ', users.surname) AS full_name,
                    comments.text,
                    comments.likes,
                    comments.created_at,
                    EXISTS(
                        SELECT 1 FROM comment_likes 
                        WHERE comment_likes.comment_id = comments.id 
                        AND comment_likes.user_id = %s
                    ) AS liked
                FROM 
                    comments
                JOIN 
                    users ON comments.user_id = users.id
                ORDER BY 
                    comments.created_at DESC
            """
            cursor.execute(query, (user_id,))
            comments = cursor.fetchall()
        return jsonify(comments), 200
    finally:
        connection.close()


# Add a new comment
@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.json
    user_id = data.get('user_id')
    text = data.get('text')

    if not user_id or not text:
        return jsonify({"error": "User ID and text are required"}), 400

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            query = "INSERT INTO comments (user_id, text, likes, created_at) VALUES (%s, %s, 0, NOW())"
            cursor.execute(query, (user_id, text))
            connection.commit()
        return jsonify({"message": "Comment added successfully"}), 201
    finally:
        connection.close()


# Toggle like or unlike on a comment
@app.route('/api/comments/<int:comment_id>/like', methods=['PATCH'])
def toggle_like(comment_id):
    data = request.json
    user_id = data.get('user_id')  # Pass the user_id from the frontend

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Check if the user has already liked the comment
            cursor.execute("SELECT * FROM comment_likes WHERE user_id = %s AND comment_id = %s", (user_id, comment_id))
            like = cursor.fetchone()

            if like:
                # Unlike the comment
                cursor.execute("DELETE FROM comment_likes WHERE user_id = %s AND comment_id = %s", (user_id, comment_id))
                cursor.execute("UPDATE comments SET likes = likes - 1 WHERE id = %s", (comment_id,))
                connection.commit()
                return jsonify({"message": "Like removed"}), 200
            else:
                # Like the comment
                cursor.execute("INSERT INTO comment_likes (user_id, comment_id) VALUES (%s, %s)", (user_id, comment_id))
                cursor.execute("UPDATE comments SET likes = likes + 1 WHERE id = %s", (comment_id,))
                connection.commit()
                return jsonify({"message": "Comment liked"}), 200
    finally:
        connection.close()






# Uygulamayı başlat
if __name__ == '__main__':
    app.run(debug=True, port=5000)
