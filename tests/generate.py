import requests
from faker import Faker
from random import choice

fake = Faker()

# URL of the register endpoint
REGISTER_URL = "http://localhost:5000/api/register"

# Helper function to create a random user by registering through the API
def create_random_user():
    # Generate random user data
    username = fake.user_name()
    first_name = fake.first_name()
    last_name = fake.last_name()
    email = fake.email()
    telephone = fake.phone_number()
    role = choice(["user", "admin"])  # Randomly assign a role
    status = choice(["active", "inactive"])
    password = fake.password()

    # Prepare the data to be sent in the request
    data = {
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "telephone": telephone,
        "role": role,
        "status": status,
        "password": password
    }

    # Make a POST request to register the user
    try:
        response = requests.post(REGISTER_URL, json=data)
        if response.status_code == 201:
            print(f"Successfully created user {username} with email {email}")
        else:
            print(f"Failed to create user {username}: {response.json().get('error')}")
    except Exception as e:
        print(f"Error while creating user {username}: {e}")

# Create 1000 random users via API
for _ in range(1000):
    create_random_user()
