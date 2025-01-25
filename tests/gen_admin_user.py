import requests
import json
REGISTER_URL = "http://localhost:5000/api/register"
# username = fake.user_name()
#     first_name = fake.first_name()
#     last_name = fake.last_name()
#     email = fake.email()
#     telephone = fake.phone_number()
#     role = choice(["user", "admin"])  # Randomly assign a role
#     status = choice(["active", "inactive"])
#     password = fake.password()
def generate_admin_user():
    data = {
        "username": "admin",
        "first_name": "admin",
        "last_name": "admin",
        "email": "admin@example.com",
        "telephone": "123456789",
        "role": "admin",
        "status": "active",
        "password": "admin"
    }
    response = requests.post(REGISTER_URL, json=data)
    if response.status_code == 201:
        print(f"Successfully created admin user")
    else:
        print(f"Failed to create admin user: {response.json().get('error')}")
generate_admin_user()