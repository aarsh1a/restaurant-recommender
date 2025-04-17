-- users
CREATE TABLE USERS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- restaurants
CREATE TABLE RESTAURANTS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    price_range TEXT NOT NULL,
    rating REAL NOT NULL
);

-- favorites 
CREATE TABLE FAVORITES (
    user_id INTEGER,
    restaurant_id INTEGER,
    PRIMARY KEY (user_id, restaurant_id),
    FOREIGN KEY (user_id) REFERENCES USERS (id),
    FOREIGN KEY (restaurant_id) REFERENCES RESTAURANTS (id)
);
