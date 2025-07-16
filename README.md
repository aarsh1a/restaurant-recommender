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
<img width="467" height="289" alt="image" src="https://github.com/user-attachments/assets/efc7826f-13e0-4082-ba89-289648a5813c" />
<img width="467" height="276" alt="image" src="https://github.com/user-attachments/assets/202853a9-0943-42c0-a549-0d5eee066a1e" />


login / signup:  
<img width="482" height="283" alt="image" src="https://github.com/user-attachments/assets/64424e4f-ca5b-4bda-9e29-d57985f1e7ac" />



favorites page:  
<img width="476" height="302" alt="image" src="https://github.com/user-attachments/assets/e9a595ea-86b7-4b03-ac3e-919d1983cd06" />


account page:  
<img width="470" height="283" alt="image" src="https://github.com/user-attachments/assets/2525ba40-332e-47a4-88cd-68bcba173287" />


## setup
1. clone this repo  
2. install dependencies:  
   ```bash
   pip install flask flask-cors
3.run the backend
python app.py
4. open index.html in your browser
