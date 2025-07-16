# restaurant finder

a simple web‑based app to find restaurants based on location, cuisine, price range, and rating. built using flask (python), sqlite, html/css, and javascript.

## features
- filter restaurants by cuisine, location, price range, and rating
- manage user favorites (add/remove)
- user login and registration
- stores restaurant data in sqlite database
- clean, hand‑drawn style frontend interface

## tech stack
- python (flask)
- sqlite
- html, css, javascript

## database tables
- users
- restaurants
- favorites

## api endpoints
- `/restaurants` – get filtered restaurant list
- `/add_favorite` – add restaurant to favorites
- `/favorites` – list user favorites
- `/remove_favorite` – remove restaurant from favorites
- `/locations` – list unique locations
- `/cuisines` – list unique cuisines
- `/register` – register new user
- `/login` – user login

## screenshots

landing page:  
![landing page](screenshots/landing.png)

login / signup:  
![login page](screenshots/login.png)

favorites page:  
![favorites page](screenshots/favorites.png)

account page:  
![account page](screenshots/account.png)

## setup
1. clone this repo  
2. install dependencies:  
   ```bash
   pip install flask flask-cors
3.run the backend
python app.py
4. open index.html in your browser
