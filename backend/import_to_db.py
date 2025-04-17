import sqlite3
import pandas as pd

df = pd.read_csv('cleaned_sampled_zomato.csv')

df['name'] = ['Restaurant ' + str(i) for i in range(1, len(df) + 1)]

df = df[['name', 'location', 'cuisine', 'price', 'rating']]
df.columns = ['name', 'location', 'cuisine', 'price_range', 'rating']

conn = sqlite3.connect('database.db')
cursor = conn.cursor()

cursor.execute("DELETE FROM restaurants")
conn.commit()

for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO restaurants (name, location, cuisine, price_range, rating)
        VALUES (?, ?, ?, ?, ?)
    """, (row['name'], row['location'], row['cuisine'], row['price_range'], row['rating']))

conn.commit()
conn.close()

print("table updated")
