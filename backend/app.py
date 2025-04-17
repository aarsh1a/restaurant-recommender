from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app) 

def connect_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row  
    return conn


@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    conn = connect_db()
    cursor = conn.cursor()

    query = "SELECT * FROM RESTAURANTS WHERE 1=1"
    params = []

    # Price range: show restaurants with price <= selected price
    # Price range: show restaurants with price <= selected price
    if 'price_range' in request.args:
        try:
            price = int(request.args['price'])
            query += " AND price_range <= ?"
            params.append(price)
        except ValueError:
            print("Invalid price value:", request.args['price'])
    # Location filter
    if 'location' in request.args:
        query += " AND location = ?"
        params.append(request.args['location'])

    # Rating: show restaurants with rating >= selected stars
    if 'rating' in request.args:
        try:
            rating = float(request.args['rating'])
            query += " AND rating >= ?"
            params.append(rating)
        except ValueError:
            print("Invalid rating value:", request.args['rating'])

    # Cuisine filter
    if 'cuisine' in request.args:
        cuisine = request.args['cuisine']
        query += " AND cuisine LIKE ?"
        params.append(f"%{cuisine}%")

    print("Final SQL Query:", query)
    print("With Parameters:", params)

    cursor.execute(query, params)
    restaurants = cursor.fetchall()
    conn.close()

    restaurant_list = [dict(row) for row in restaurants]
    return jsonify(restaurant_list), 200

@app.route('/add_favorite', methods=['POST'])
def add_favorite():
    data = request.json
    user_id = data.get('user_id')
    restaurant_id = data.get('restaurant_id')

    if not user_id or not restaurant_id:
        return jsonify({"error": "Missing user_id or restaurant_id"}), 400

    conn = connect_db()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO FAVORITES (user_id, restaurant_id) VALUES (?, ?)", (user_id, restaurant_id))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "This restaurant is already in favorites"}), 400
    finally:
        conn.close()
    
    return jsonify({"message": "Favorite added"}), 201

@app.route('/favorites', methods=['GET'])
def get_favorites():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT R.* FROM RESTAURANTS R 
        JOIN FAVORITES F ON R.id = F.restaurant_id 
        WHERE F.user_id = ?
    """, (user_id,))

    favorites = cursor.fetchall()
    conn.close()

    favorite_list = [dict(row) for row in favorites]

    return jsonify(favorite_list), 200
@app.route('/remove_favorite', methods=['POST'])
def remove_favorite():
    data = request.json
    user_id = data.get('user_id')
    restaurant_id = data.get('restaurant_id')

    if not user_id or not restaurant_id:
        return jsonify({"error": "Missing user_id or restaurant_id"}), 400

    conn = connect_db()
    cursor = conn.cursor()

    try:
        # Check if the favorite exists
        cursor.execute("SELECT * FROM FAVORITES WHERE user_id = ? AND restaurant_id = ?", 
                      (user_id, restaurant_id))
        favorite = cursor.fetchone()
        
        if not favorite:
            return jsonify({"error": "Favorite not found"}), 404
            
        # Delete the favorite
        cursor.execute("DELETE FROM FAVORITES WHERE user_id = ? AND restaurant_id = ?", 
                      (user_id, restaurant_id))
        conn.commit()
        
        return jsonify({"message": "Favorite removed successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/locations', methods=['GET'])
def get_locations():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT location FROM RESTAURANTS ORDER BY location")
    locations = cursor.fetchall()
    conn.close()
    
    location_list = [dict(row)['location'] for row in locations]
    return jsonify(location_list), 200

@app.route('/cuisines', methods=['GET'])
def get_cuisines():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT cuisine FROM RESTAURANTS ORDER BY cuisine")
    cuisines = cursor.fetchall()
    conn.close()
    # Generate unique tags
    unique_cuisines = set()
    for row in cuisines:
        cuisines_list = row['cuisine'].split(",")  # Split multiple cuisines
        for cuisine in cuisines_list:
            unique_cuisines.add(cuisine.strip())  # Remove extra spaces
    return jsonify(sorted(unique_cuisines)), 200

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    # Basic validation
    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    conn = connect_db()
    cursor = conn.cursor()
    
    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        conn.close()
        return jsonify({"error": "Email already registered"}), 400
    
    try:
        # Insert new user
        # For simplicity, we're storing the password directly
        # In a production app, you should hash the password with werkzeug.security.generate_password_hash
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, password)
        )
        conn.commit()
        
        # Get the user ID of the newly created user
        user_id = cursor.lastrowid
        
        conn.close()
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    
    except sqlite3.Error as e:
        conn.close()
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    conn = connect_db()
    cursor = conn.cursor()
    
    # Get user with matching email and password
    cursor.execute("SELECT id, name FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Convert to dict for JSON serialization
    user_dict = dict(user)
    return jsonify({"message": "Login successful", "user": user_dict}), 200


if __name__ == '__main__':
    app.run(debug=True)
