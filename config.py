import os
from os.path import dirname
from dotenv import load_dotenv

load_dotenv()
print(dirname(__file__))
print(os.getenv("DATABASE_URL"))


class Config:
    Debug = True
    Testing = False
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "default_secret_key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_jwt_secret_key")
    # OFFERS_SERVICE_URL = os.getenv("OFFERS_SERVICE_URL")
    # REFRESH_TOKEN = os.getenv("REFRESH_TOKEN")
    # AUTH_ENDPOINT = os.getenv("AUTH_ENDPOINT")
    # START_SCHEDULER_ON_STARTUP = os.getenv("START_SCHEDULER_ON_STARTUP")

