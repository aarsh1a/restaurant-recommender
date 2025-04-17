import sqlite3
import pandas as pd

# Step 1: Load your cleaned CSV
df = pd.read_csv("cleaned_with_names.csv")

# Step 2: Rename columns to match your DB
df.rename(columns={
    "cuisines": "cuisine",
    "price": "price_range"
}, inplace=True)

# Drop id if it exists
if "id" in df.columns:
    df.drop(columns=["id"], inplace=True)

# Match column order with your DB
df = df[["name", "location", "cuisine", "price_range", "rating"]]

# Make sure price_range is string
df["price_range"] = df["price_range"].astype(str)

# Step 3: Connect to DB
conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# Step 4: Clear existing data
cursor.execute("DELETE FROM restaurants")
conn.commit()

# Step 5: INSERT manually row by row (no pandas trying to create tables)
for _, row in df.iterrows():
    cursor.execute("""
        INSERT INTO restaurants (name, location, cuisine, price_range, rating)
        VALUES (?, ?, ?, ?, ?)
    """, tuple(row))

conn.commit()
conn.close()

print("✨ Success! Database is updated with your clean data.")
