import requests
import random
import string
import time
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Define the API URL
API_URL = 'https://dobsinskym.com/api'

# Authentication credentials
USERNAME = 'admin'
PASSWORD = 'admin'

# Session to maintain cookies and authentication
session = requests.Session()

# Function to login and get authentication tokens
def login():
    login_data = {
        "username": USERNAME,
        "password": PASSWORD
    }
    try:
        response = session.post(f'{API_URL}/login', json=login_data, headers={
            "Content-Type": "application/json"
        })
        if response.status_code == 200:
            print("Login successful! Authentication tokens set.")
            return True
        else:
            print(f"Login failed. Status code: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"Login error: {e}")
        return False

# Function to generate random product data using Faker
def generate_random_product(category_id):
    return {
        "name": fake.word().capitalize() + " " + fake.word().capitalize(),  # Random product name with two words
        "description": fake.paragraph(nb_sentences=3),  # Fake product description
        "price": round(random.uniform(10, 110), 2),  # Random price between 10 and 110
        "stock_quantity": random.randint(1, 50),  # Random stock between 1 and 50
        "category_id": category_id  # Use the category ID from the created category
    }

# Function to create a category
def create_category(category_name):
    category_data = {
        "name": category_name,
        "parent_id": None  # You can change this if you need parent-child categories
    }
    response = session.post(f'{API_URL}/categories', json=category_data, headers={
        "Content-Type": "application/json"
    })
    if response.status_code == 201:
        print(f"Category '{category_name}' created successfully! ID: {response.json()['id']}")
        return response.json()['id']
    else:
        print(f"Failed to create category '{category_name}'. Status code: {response.status_code}")
        print(response.text)  # Print error details
        return None

# Function to create products for a given category
def create_products_for_category(category_id, num_products=10):
    for _ in range(num_products):
        product_data = generate_random_product(category_id)
        response = session.post(f'{API_URL}/products', json=product_data, headers={
            "Content-Type": "application/json"
        })
        if response.status_code == 201:
            print(f"Product '{product_data['name']}' created successfully!")
        else:
            print(f"Failed to create product '{product_data['name']}'. Status code: {response.status_code}")
            print(response.text)  # Print error details

# Main function to create categories and products
def create_categories_and_products(num_categories=5, products_per_category=5):
    if not login():
        print("Authentication failed. Cannot create categories and products.")
        return
        
    for i in range(num_categories):
        category_name = fake.word().capitalize() + " " + fake.word().capitalize()  # Random category name with two words
        category_id = create_category(category_name)
        if category_id:
            create_products_for_category(category_id, num_products=products_per_category)

if __name__ == "__main__":
    create_categories_and_products()
