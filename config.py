import os
from os.path import dirname
from dotenv import load_dotenv

load_dotenv()
print(dirname(__file__))
print(os.getenv("DATABASE_URL"))


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    OFFERS_SERVICE_URL = os.getenv("OFFERS_SERVICE_URL")
    REFRESH_TOKEN = os.getenv("REFRESH_TOKEN")
    AUTH_ENDPOINT = os.getenv("AUTH_ENDPOINT")
    START_SCHEDULER_ON_STARTUP = os.getenv("START_SCHEDULER_ON_STARTUP")
