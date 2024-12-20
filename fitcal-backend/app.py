from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import bcrypt
import requests
import logging
import re
from requests.auth import HTTPBasicAuth

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

# FatSecret API bilgileri
client_id = "52d04e4b3933478f93af98467bea88b2"  # API'den alınan Client ID
client_secret = "317f95657130487b856ba70ae5a93370"  # API'den alınan Client Secret

#------------------------------------------------------------------------------------------

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

def parse_food_description(food_description):
    try:
        print(f"DEBUG - Gelen food_description: {food_description}")

        if not food_description or len(food_description.strip()) == 0:
            print("ERROR - food_description boş!")
            # Default to 0 if empty
            return 0, 0, 0, 0

        # Attempt to parse the food_description
        parts = food_description.split('|')
        calories = fat = carbs = protein = 0

        for part in parts:
            part = part.strip()
            if "Calories" in part:
                calories = float(part.split(':')[1].replace('kcal', '').strip())
            elif "Fat" in part:
                fat = float(part.split(':')[1].replace('g', '').strip())
            elif "Carbs" in part:
                carbs = float(part.split(':')[1].replace('g', '').strip())
            elif "Protein" in part:
                protein = float(part.split(':')[1].replace('g', '').strip())

        print(f"DEBUG - Ayrıştırılan Değerler: Calories: {calories}, Fat: {fat}, Carbs: {carbs}, Protein: {protein}")
        return calories, fat, carbs, protein

    except Exception as e:
        print(f"Hata: {e}")
        # Log error and default to 0
        logging.error(f"parse_food_description error: {e}")
        return 0, 0, 0, 0



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

            # Kullanıcıyı ekleme (starting_weight = weight)
            query = """
                INSERT INTO users (name, surname, email, password, weight, starting_weight, height, age, gender)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (name, surname, email, hashed_password, weight, weight, height, age, gender))
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

def save_search_history(user_id, search_term, translated_term):
    """
    Arama sorgusunu food_search_history tablosuna kaydeder.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                INSERT INTO food_search_history (user_id, search_term, translated_term)
                VALUES (%s, %s, %s)
            """
            cursor.execute(query, (user_id, search_term, translated_term))
            connection.commit()
            print("Arama geçmişi kaydedildi.")
    except Exception as e:
        logging.error(f"Arama geçmişi kaydetme hatası: {str(e)}")
    finally:
        connection.close()

#------------------------------------------------------------------------------------------


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

@app.route('/api/check_profile', methods=['POST'])
def check_profile():
    """
    Kullanıcının user_profiles tablosunda verisi olup olmadığını kontrol eder.
    """
    data = request.json
    user_id = data.get('user_id')  # Kullanıcı ID'sini al

    if not user_id:
        return jsonify({"error": "Kullanıcı ID eksik"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Kullanıcının profilini kontrol et
            query = "SELECT * FROM user_profiles WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()

            if result:
                return jsonify({"exists": True}), 200  # Kayıt varsa exists=True
            else:
                return jsonify({"exists": False}), 200  # Kayıt yoksa exists=False
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


#------------------------------------------------------------------------------------------

@app.route('/api/food_search', methods=['POST'])
def food_search():
    """
    Türkçe arama terimini İngilizce'ye çevirip FatSecret API'den arama yapma.
    Arama sorgusunu ayrıca food_search_history tablosuna kaydeder.
    """
    data = request.json
    search_expression = data.get("query")
    user_id = data.get("user_id")

    if not search_expression or not user_id:
        return jsonify({"error": "Arama terimi veya kullanıcı ID'si eksik"}), 400

    # 1. Hardcoded çeviri kontrolü
    translations = {"elma": "apple", "tavuk": "chicken"}
    translated_expression = translations.get(search_expression.lower())

    if not translated_expression:
        # Çeviri API'sini kullan
        translated_expression = translate_text(search_expression)
        if not translated_expression:
            return jsonify({"error": "Çeviri işlemi başarısız. İngilizce terim giriniz."}), 500

    print(f"Arama Terimi: {search_expression} -> Çevrilen: {translated_expression}")  # Debug

    # 2. FatSecret API için Token Alma
    token_url = "https://oauth.fatsecret.com/connect/token"
    auth = HTTPBasicAuth(client_id, client_secret)
    payload = {"grant_type": "client_credentials"}

    try:
        response = requests.post(token_url, auth=auth, data=payload)
        if response.status_code != 200:
            print(f"Token Hatası: {response.text}")
            return jsonify({"error": "Access token alınamadı", "details": response.text}), 500

        access_token = response.json().get("access_token")
        print(f"Alınan Access Token: {access_token}")

        # 3. FatSecret API'ye Arama Yapma
        api_url = "https://platform.fatsecret.com/rest/server.api"
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {
            "method": "foods.search",
            "search_expression": translated_expression,
            "format": "json"
        }

        api_response = requests.get(api_url, headers=headers, params=params)
        print(f"API İsteği: {params}")
        print(f"API Yanıtı: {api_response.status_code} - {api_response.text}")

        if api_response.status_code == 200:
            # API'den gelen sonucu işle
            foods = api_response.json().get('foods', {}).get('food', [])
            print(f"FatSecret API'den Gelen Veri: {foods}")
            save_search_history(user_id, search_expression, translated_expression)
            return jsonify({"results": foods}), 200
        else:
            logging.error(f"FatSecret API Hatası: {api_response.text}")
            return jsonify({"error": "FatSecret API isteği başarısız", "details": api_response.text}), 500

    except Exception as e:
        logging.error(f"Food search error: {str(e)}")
        return jsonify({"error": "Sunucu hatası", "details": str(e)}), 500



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

    # Debug için gelen veriyi kontrol et
    print("DEBUG - Gelen Veri:")
    print(f"Food Name: {food_name}")
    print(f"Calories: {calories}, Fat: {fat}, Carbs: {carbs}, Protein: {protein}, Gram: {gram}")

    if not all([food_name, gram]):
        return jsonify({"error": "Yemek adı ve gram bilgisi gereklidir"}), 400

    # Besin değerlerini orantılı olarak hesapla
    adjusted_calories = (calories * gram) / 100
    adjusted_fat = (fat * gram) / 100
    adjusted_carbs = (carbs * gram) / 100
    adjusted_protein = (protein * gram) / 100

    print("DEBUG - Hesaplanan Değerler:")
    print(
        f"Adjusted Calories: {adjusted_calories}, Adjusted Fat: {adjusted_fat}, Adjusted Carbs: {adjusted_carbs}, Adjusted Protein: {adjusted_protein}")

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
    print(f"DEBUG - Gelen Veriler: {data}")  # Gelen tüm veriyi logla

    # Gerekli verileri al
    user_id = data.get("user_id")
    meal_type = data.get("meal_type")
    food_name = data.get("food_name")
    food_description = data.get("food_description", "")

    # food_description parse edilerek besin değerleri hesaplanır
    calories, fat, carbs, protein = parse_food_description(food_description)

    print(f"DEBUG - Ayrıştırılan Besin Değerleri: Calories: {calories}, Fat: {fat}, Carbs: {carbs}, Protein: {protein}")

    # Giriş verilerini kontrol et
    if not all([user_id, meal_type, food_name]):
        return jsonify({"error": "Kullanıcı ID, öğün türü ve yemek adı gereklidir"}), 400

    # Veritabanı bağlantısı
    connection = None
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Kullanıcı, öğün türü ve yemek adı kombinasyonunun var olup olmadığını kontrol et
            check_query = """
                SELECT 1 FROM user_meals 
                WHERE user_id = %s AND meal_type = %s AND food_name = %s
            """
            cursor.execute(check_query, (user_id, meal_type, food_name))
            if cursor.fetchone():
                return jsonify({
                    "message": f"'{food_name}' zaten '{meal_type}' öğününe eklenmiş.",
                    "status": "duplicate"
                }), 409  # HTTP 409: Conflict

            # Yiyeceği veritabanına ekle
            insert_query = """
                INSERT INTO user_meals 
                (user_id, meal_type, food_name, calories, fat, carbs, protein) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (user_id, meal_type, food_name, calories, fat, carbs, protein))
            connection.commit()
            print("DEBUG - Yiyecek başarıyla eklendi.")

        return jsonify({
            "message": f"'{food_name}' '{meal_type}' öğününe başarıyla eklendi.",
            "status": "success"
        }), 200

    except Exception as e:
        logging.error(f"Veritabanı hatası: {str(e)}")
        return jsonify({"error": "Sunucu hatası, lütfen tekrar deneyiniz."}), 500

    finally:
        if connection:
            connection.close()
            print("DEBUG - Veritabanı bağlantısı kapatıldı.")



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
                SELECT 
                    u.email, 
                    CONCAT(u.name, ' ', u.surname) AS full_name, 
                    u.height, 
                    u.weight, 
                    u.gender, 
                    COALESCE(up.activity_level, 'Not Specified') AS activity_level, 
                    COALESCE(up.exercise_frequency, 'Not Specified') AS exercise_frequency
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE u.id = %s
            """
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()

            print(f"DEBUG - Query Result: {result}")  # Debugging

            if result:
                return jsonify(result), 200
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



#######e--------------------------------------------------------------------------WaterPage database




@app.route('/api/add_water', methods=['POST'])
def add_water():
    """
    Adds water consumption for a user and updates the total.
    """
    data = request.json
    user_id = data.get('user_id')
    water_to_add = data.get('water_to_add')  # Water in liters

    if not user_id or water_to_add is None:
        return jsonify({"error": "User ID and water amount are required"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Check if the user already exists
            cursor.execute("SELECT total_water FROM user_water WHERE user_id = %s", (user_id,))
            result = cursor.fetchone()

            if result:
                # Update existing total
                new_total = result['total_water'] + water_to_add
                cursor.execute(
                    "UPDATE user_water SET total_water = %s WHERE user_id = %s",
                    (new_total, user_id)
                )
            else:
                # Insert new record
                cursor.execute(
                    "INSERT INTO user_water (user_id, total_water) VALUES (%s, %s)",
                    (user_id, water_to_add)
                )
            connection.commit()

        return jsonify({"message": "Water added successfully", "new_total": new_total}), 200
    except Exception as e:
        logging.error(f"Error updating water: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/get_water', methods=['POST'])
def get_water():
    """
    Fetches the total water consumption for a user.
    """
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT total_water FROM user_water WHERE user_id = %s", (user_id,))
            result = cursor.fetchone()

        return jsonify({"total_water": result['total_water'] if result else 0}), 200
    except Exception as e:
        logging.error(f"Error fetching water: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

#####---------------------------------------------------------------------------------------------- Ayarlar benim kilom kısmı

@app.route('/api/weight/<int:user_id>', methods=['GET'])
def get_weight_data(user_id):
    """
    Fetch current weight, starting weight, and target weight for the user.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                SELECT 
                    u.weight AS current_weight,  -- Use 'weight' instead of 'current_weight'
                    u.starting_weight, 
                    up.target_weight 
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE u.id = %s
            """
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()
            if result:
                return jsonify({
                    "current_weight": result['current_weight'] or 0,
                    "starting_weight": result['starting_weight'] or 0,
                    "target_weight": result['target_weight'] or 0
                }), 200
            return jsonify({"error": "Weight data not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()





#####-----------------------------------------------------------------

@app.route('/api/weight/<int:user_id>', methods=['POST'])
def update_weight(user_id):
    """
    Update the weight and/or target weight for the user.
    """
    data = request.json
    new_weight = data.get('current_weight')  # Expect 'current_weight' from the frontend
    new_target_weight = data.get('target_weight')

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            if new_weight is not None:
                # Update only the current weight
                cursor.execute(
                    """
                    UPDATE users 
                    SET weight = %s
                    WHERE id = %s
                    """,
                    (new_weight, user_id)
                )
            if new_target_weight is not None:
                # Update the target weight in the user_profiles table
                cursor.execute(
                    "UPDATE user_profiles SET target_weight = %s WHERE user_id = %s",
                    (new_target_weight, user_id)
                )
            connection.commit()
            return jsonify({"message": "Weight data updated successfully"}), 200
    except Exception as e:
        logging.error(f"Error updating weight: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()

#---------------------------------------------------------------------------------------------------

@app.route('/api/add_exercise_entry', methods=['POST'])
def add_exercise_entry():
    data = request.json
    user_id = data.get('user_id')
    name = data.get('name')
    duration = data.get('duration')
    calories = data.get('calories')

    if not all([user_id, name, duration, calories]):
        return jsonify({"error": "All fields (user_id, name, duration, calories) are required"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = "INSERT INTO exercise_entries (user_id, name, duration, calories) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (user_id, name, duration, calories))
            connection.commit()
        return jsonify({"message": "Exercise entry added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


@app.route('/api/get_exercise_entries', methods=['GET'])
def get_exercise_entries():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = "SELECT id, name, duration, calories FROM exercise_entries WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            entries = cursor.fetchall()
        return jsonify(entries), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()





@app.route('/api/calorie_summary/<int:user_id>', methods=['GET'])
def calorie_summary(user_id):
    """
    Kullanıcının toplam kalorilerini ve öğün bazında yüzdesel dağılımını döner.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Öğün bazında toplam kaloriyi hesapla
            query = """
                SELECT meal_type, SUM(calories) AS total_calories
                FROM user_meals
                WHERE user_id = %s
                GROUP BY meal_type
            """
            cursor.execute(query, (user_id,))
            meal_totals = cursor.fetchall()

            # Toplam kaloriyi hesapla
            total_calories = sum(row['total_calories'] for row in meal_totals)

            # Öğün bazında yüzdesel dağılımı hesapla
            calorie_summary = []
            for row in meal_totals:
                percentage = (row['total_calories'] / total_calories * 100) if total_calories > 0 else 0
                calorie_summary.append({
                    "meal_type": row['meal_type'],
                    "calories": row['total_calories'],
                    "percentage": round(percentage, 2)
                })

        return jsonify({
            "total_calories": total_calories,
            "calorie_summary": calorie_summary
        }), 200

    except Exception as e:
        logging.error(f"Error in calorie_summary: {str(e)}")
        return jsonify({"error": "Sunucu hatası"}), 500
    finally:
        connection.close() 


@app.route('/api/macro_summary/<int:user_id>', methods=['GET'])
def macro_summary(user_id):
    """
    Return macro data with gram values and percentages.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Query total macro values and total calories
            query = """
                SELECT 
                    SUM(carbs) AS total_carbs,
                    SUM(fat) AS total_fats,
                    SUM(protein) AS total_proteins,
                    SUM(calories) AS total_calories
                FROM user_meals
                WHERE user_id = %s
            """
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()

            total_calories = result["total_calories"] or 1  # Avoid division by zero

            # Macro calorie contributions
            macro_data = {
                "carbs": {
                    "grams": result["total_carbs"] or 0,
                    "consumed": round((result["total_carbs"] * 4 / total_calories) * 100, 2) if total_calories else 0,
                    "target": 50
                },
                "fats": {
                    "grams": result["total_fats"] or 0,
                    "consumed": round((result["total_fats"] * 9 / total_calories) * 100, 2) if total_calories else 0,
                    "target": 30
                },
                "proteins": {
                    "grams": result["total_proteins"] or 0,
                    "consumed": round((result["total_proteins"] * 4 / total_calories) * 100, 2) if total_calories else 0,
                    "target": 20
                }
            }

        return jsonify(macro_data), 200
    except Exception as e:
        logging.error(f"Error fetching macro summary: {e}")
        return jsonify({"error": "Server error", "details": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/total_macros', methods=['POST'])
def calculate_total_macros():
    """
    Calculate total protein, carbs, fat, and calories for the user.
    """
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                SELECT 
                    SUM(protein) AS total_protein,
                    SUM(carbs) AS total_carbs,
                    SUM(fat) AS total_fat,
                    SUM(calories) AS total_calories
                FROM user_meals
                WHERE user_id = %s
            """
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()

            return jsonify({
                "total_protein": result['total_protein'] or 0,
                "total_carbs": result['total_carbs'] or 0,
                "total_fat": result['total_fat'] or 0,
                "total_calories": result['total_calories'] or 0
            }), 200
    except Exception as e:
        logging.error(f"Error calculating total macros: {e}")
        return jsonify({"error": "Server error", "details": str(e)}), 500
    finally:
        connection.close()


@app.route('/api/calculate_target_calories/<int:user_id>', methods=['GET'])
def calculate_target_calories(user_id):
    """
    Calculate BMR and TDEE for the user based on profile details.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Fetch user data
            query = """
                SELECT 
                    u.weight, u.height, u.age, u.gender, 
                    COALESCE(up.activity_level, 'Sedentary') AS activity_level
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE u.id = %s
            """
            cursor.execute(query, (user_id,))
            user = cursor.fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 404

            # Validate data
            weight = user["weight"]
            height = user["height"]
            age = user["age"]
            gender = user["gender"]
            activity_level = user["activity_level"]

            if not all([weight, height, age, gender]):
                return jsonify({"error": "Incomplete user data"}), 400

            # BMR calculation (Mifflin-St Jeor)
            if gender.lower() == 'male':
                bmr = 10 * weight + 6.25 * height - 5 * age + 5
            else:
                bmr = 10 * weight + 6.25 * height - 5 * age - 161

            # TDEE calculation based on activity level
            activity_multipliers = {
                "Sedentary": 1.2,
                "Lightly active": 1.375,
                "Moderately active": 1.55,
                "Very active": 1.725,
                "Extra active": 1.9
            }
            tdee = bmr * activity_multipliers.get(activity_level, 1.2)

            return jsonify({
                "bmr": round(bmr, 2),
                "tdee": round(tdee, 2)
            }), 200
    except Exception as e:
        logging.error(f"Error calculating target calories: {e}")
        return jsonify({"error": "Server error", "details": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/get_meals_by_type', methods=['POST'])
def get_meals_by_type():
    data = request.json
    user_id = data.get("user_id")
    meal_type = data.get("meal_type")

    if not user_id or not meal_type:
        return jsonify({"error": "Kullanıcı ID ve öğün türü gereklidir"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                SELECT food_name, calories, protein, carbs, fat
                FROM user_meals
                WHERE user_id = %s AND meal_type = %s
                ORDER BY created_at DESC
            """
            cursor.execute(query, (user_id, meal_type))
            meals = cursor.fetchall()

        return jsonify({"meals": meals}), 200

    except Exception as e:
        logging.error(f"Veritabanı hatası: {str(e)}")
        return jsonify({"error": "Sunucu hatası"}), 500
    finally:
        connection.close()









# Uygulamayı başlat
if __name__ == '__main__':
    print("Starting Flask server at http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=False)


