from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import bcrypt
import requests
import logging
from requests.auth import HTTPBasicAuth


# Flask uygulaması başlatma
app = Flask(__name__)
CORS(app)

# FatSecret API bilgileri
client_id = "52d04e4b3933478f93af98467bea88b2"  # API'den alınan Client ID
client_secret = "4d7245106d384fd593977cd43ca2e44a"  # API'den alınan Client Secret

#------------------------------------------------------------------------------------------

# Veritabanı bağlantı bilgileri
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "12345",
    "database": "app_db"
}


@app.route('/')
def home():
    return jsonify({"message": "Flask server is running!"}), 200

# Veritabanına bağlanma fonksiyonu
def get_db_connection():
    return pymysql.connect(
        host=db_config["host"],
        user=db_config["user"],
        password=db_config["password"],
        database=db_config["database"],
        cursorclass=pymysql.cursors.DictCursor
    )

# Hata loglama yapılandırması
logging.basicConfig(filename='error.log', level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')

#------------------------------------------------------------------------------------------




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

    # Boş alan kontrolü
    if not all([name, surname, email, password, weight, height, age, gender]):
        return jsonify({"error": "Tüm alanlar doldurulmalıdır"}), 400

    # Şifreyi hashleme
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Duplicate e-posta kontrolü
            check_query = "SELECT id FROM users WHERE email = %s"
            cursor.execute(check_query, (email,))
            if cursor.fetchone():
                return jsonify({"error": "Bu e-posta adresi zaten kullanılıyor"}), 409

            # Kullanıcıyı ekleme
            query = """
                INSERT INTO users (name, surname, email, password, weight, height, age, gender)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (name, surname, email, hashed_password, weight, height, age, gender))
            connection.commit()
        return jsonify({"message": "User registered successfully"}), 200

    except pymysql.MySQLError as e:
        # Hata loglama
        error_message = f"Database error: {str(e)}"
        logging.error(error_message)
        print(error_message)  # Terminalde göster
        return jsonify({"error": "Veritabanı hatası oluştu", "details": str(e)}), 500

    except Exception as ex:
        # Genel hata yakalama ve loglama
        error_message = f"Unexpected error: {str(ex)}"
        logging.error(error_message)
        print(error_message)  # Terminalde göster
        return jsonify({"error": "Bilinmeyen bir hata oluştu", "details": str(ex)}), 500

    finally:
        if connection:
            connection.close()

#------------------------------------------------------------------------------------------

# Kullanıcı giriş endpoint'i
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "E-posta ve şifre alanları boş bırakılamaz"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # E-posta adresini veritabanında arama
            query = "SELECT id, password FROM users WHERE email = %s"
            cursor.execute(query, (email,))
            user = cursor.fetchone()

            if not user:
                return jsonify({"error": "Bu e-posta adresi kayıtlı değil"}), 404

            # Şifre kontrolü
            if bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
                return jsonify({
                    "message": "Giriş başarılı",
                    "user_id": user["id"]
                }), 200
            else:
                return jsonify({"error": "Şifre yanlış"}), 401
    except pymysql.MySQLError as e:
        # Hata loglama eklenebilir
        return jsonify({"error": "Veritabanı hatası", "details": str(e)}), 500
    finally:
        connection.close()

#------------------------------------------------------------------------------------------


"""def translate_text(text, source_lang="tr", target_lang="en"):
    url = "http://127.0.0.1:5001/translate"  # LibreTranslate farklı porta taşındı
    payload = {
        "q": text,
        "source": source_lang,
        "target": target_lang,
        "format": "text"
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json().get("translatedText")
    except requests.exceptions.RequestException as e:
        logging.error(f"Çeviri API hatası: {str(e)}")
        return None

# Test
turkish_word = "elma"
english_word = translate_text(turkish_word)
print("Çevrilmiş kelime:", english_word)"""


def translate_text(text, source_lang="tr", target_lang="en"):
    """
    Türkçe kelimeyi İngilizceye çevirir. Eğer çeviri başarısız olursa kullanıcıdan İngilizce kelime ister.
    """
    url = "http://127.0.0.1:5001/translate"  # LibreTranslate farklı porta taşındı
    payload = {
        "q": text,
        "source": source_lang,
        "target": target_lang,
        "format": "text"
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json().get("translatedText")
    except requests.exceptions.RequestException as e:
        logging.error(f"Çeviri API hatası: {str(e)}")
        print("Çeviri işlemi başarısız. Lütfen aramak istediğiniz kelimenin İngilizcesini giriniz:")

        # Kullanıcıdan İngilizce kelime girişi iste
        english_input = input("İngilizce kelime: ").strip()
        if english_input:
            print(f"Arama için kullanılan kelime: {english_input}")
            return english_input
        else:
            print("İngilizce kelime girilmedi, işlem iptal edildi.")
            return None


#------------------------------------------------------------------------------------------












   



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







#------------------------------------------------------------------------------------------

@app.route('/api/save_profile', methods=['POST'])
def save_profile():
    """
    Kullanıcı profil bilgilerini kaydetme.
    """
    data = request.json
    user_id = data.get("user_id")
    activity_level = data.get("activity_level")
    diet_preference = data.get("diet_preference")
    target_weight = data.get("target_weight")
    exercise_frequency = data.get("exercise_frequency")

    # Eksik alan kontrolü
    if not all([user_id, activity_level, diet_preference, target_weight, exercise_frequency]):
        return jsonify({"error": "Tüm alanlar doldurulmalıdır"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                INSERT INTO user_profiles (user_id, activity_level, diet_preference, target_weight, exercise_frequency)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (user_id, activity_level, diet_preference, target_weight, exercise_frequency))
            connection.commit()

        return jsonify({"message": "Profil başarıyla kaydedildi"}), 200

    except pymysql.MySQLError as e:
        logging.error(f"Veritabanı hatası: {str(e)}")
        return jsonify({"error": "Veritabanı hatası", "details": str(e)}), 500

    finally:
        connection.close()


#------------------------------------------------------------------------------------------


@app.route('/api/food_search', methods=['POST'])
def food_search():
    """
    Türkçe arama terimini İngilizce'ye çevirip FatSecret API'den arama yapma.
    """
    data = request.json
    search_expression = data.get("query")
    user_id = data.get("user_id")

    if not search_expression or not user_id:
        return jsonify({"error": "Arama terimi veya kullanıcı ID'si eksik"}), 400

    # Arama terimini İngilizce'ye çevir
    translated_expression = translate_text(search_expression)
    if not translated_expression:
        return jsonify({"error": "Çeviri işlemi başarısız"}), 500

    # FatSecret API için token alma
    token_url = "https://oauth.fatsecret.com/connect/token"
    auth = HTTPBasicAuth(client_id, client_secret)
    payload = {"grant_type": "client_credentials"}

    token_response = requests.post(token_url, auth=auth, data=payload)
    if token_response.status_code == 200:
        access_token = token_response.json().get("access_token")

        # FatSecret API'ye İngilizce arama terimi gönderme
        api_url = "https://platform.fatsecret.com/rest/server.api"
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {"method": "foods.search", "search_expression": translated_expression, "format": "json"}

        api_response = requests.get(api_url, headers=headers, params=params)
        if api_response.status_code == 200:
            foods = api_response.json().get('foods', {}).get('food', [])
            return jsonify({"results": foods}), 200
        else:
            return jsonify({"error": "API isteği başarısız", "details": api_response.text}), 500
    else:
        return jsonify({"error": "Access token alınamadı"}), 500



#------------------------------------------------------------------------------------------

@app.route('/api/calculate_food', methods=['POST'])
def calculate_food():
    """
    Seçilen yiyeceğin gramına göre besin değerlerini hesaplama.
    """
    data = request.json
    food_name = data.get("food_name")
    calories = data.get("calories", 0)
    fat = data.get("fat", 0)
    carbs = data.get("carbs", 0)
    protein = data.get("protein", 0)
    gram = data.get("gram", 100)  # Varsayılan olarak 100 gram alınıyor

    if not all([food_name, gram]):
        return jsonify({"error": "Yemek adı ve gram bilgisi gereklidir"}), 400

    # Besin değerlerini orantılı olarak hesapla
    adjusted_calories = (calories * gram) / 100
    adjusted_fat = (fat * gram) / 100
    adjusted_carbs = (carbs * gram) / 100
    adjusted_protein = (protein * gram) / 100

    return jsonify({
        "food_name": food_name,
        "gram": gram,
        "calories": round(adjusted_calories, 2),
        "fat": round(adjusted_fat, 2),
        "carbs": round(adjusted_carbs, 2),
        "protein": round(adjusted_protein, 2)
    }), 200


#------------------------------------------------------------------------------------------

@app.route('/api/save_food', methods=['POST'])
def save_food():
    """
    Kullanıcının seçtiği yiyeceği veritabanına kaydetme.
    """
    data = request.json
    user_id = data.get("user_id")
    meal_type = data.get("meal_type")  # Kahvaltı, Öğle, Akşam vb.
    food_name = data.get("food_name")
    calories = data.get("calories", 0)
    fat = data.get("fat", 0)
    carbs = data.get("carbs", 0)
    protein = data.get("protein", 0)

    # Eksik veri kontrolü
    if not all([user_id, meal_type, food_name]):
        return jsonify({"error": "Kullanıcı ID, öğün türü ve yemek adı gereklidir"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                INSERT INTO user_meals (user_id, meal_type, food_name, calories, fat, carbs, protein)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (user_id, meal_type, food_name, calories, fat, carbs, protein))
            connection.commit()
        return jsonify({"message": "Yiyecek başarıyla kaydedildi"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


#------------------------------------------------------------------------------------------

@app.route('/api/popular_foods', methods=['GET'])
def popular_foods():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                SELECT search_term, COUNT(*) as count
                FROM food_search_history
                GROUP BY search_term
                ORDER BY count DESC
                LIMIT 5
            """
            cursor.execute(query)
            results = cursor.fetchall()
        return jsonify({"popular_foods": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

#------------------------------------------------------------------------------------------

@app.route('/api/daily_summary/<int:user_id>', methods=['GET'])
def daily_summary(user_id):
    """
    Kullanıcının gün içinde aldığı toplam kaloriyi ve makro besin değerlerini hesaplama.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                SELECT SUM(calories) AS total_calories,
                       SUM(fat) AS total_fat,
                       SUM(carbs) AS total_carbs,
                       SUM(protein) AS total_protein
                FROM user_meals
                WHERE user_id = %s AND DATE(created_at) = CURDATE()
            """
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()

        return jsonify({
            "total_calories": result['total_calories'] or 0,
            "total_fat": result['total_fat'] or 0,
            "total_carbs": result['total_carbs'] or 0,
            "total_protein": result['total_protein'] or 0
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


#------------------------------------------------------------------------------------------

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
    app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=False)
