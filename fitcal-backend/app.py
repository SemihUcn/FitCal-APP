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
    "password": "1234",
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

# Uygulamayı başlat
if __name__ == '__main__':
    app.run(debug=True, port=5000)
