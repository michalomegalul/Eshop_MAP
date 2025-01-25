import requests
import json

# Define the API URL
API_URL = 'http://localhost:5000/api/categories'

# Define the category data to be created
category_data = {
    "name": "New Category",  # Category name (required)
    "parent_id": None        # Optional parent category ID (if applicable)
}

# Send the POST request to the server
response = requests.post(API_URL, json=category_data)

# Check the response status
if response.status_code == 201:
    print(f"Category created successfully! ID: {response.json()['id']}")
else:
    print(f"Failed to create category. Status code: {response.status_code}")
    print(f"Error message: {response.json()['error']}")
