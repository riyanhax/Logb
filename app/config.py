import os
import datetime
from app.constants import _JWT_PRIVATE_KEY, _JWT_PUBLIC_KEY, _JWT_SECRET_KEY
from urllib.parse import quote

BOILERPLATE_ENV = os.environ.get("BOILERPLATE_ENV", "dev")

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

path = os.getcwd()
DB_USERNAME = os.environ.get("DB_USERNAME", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "11111111")
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", "3306")

STORE_DB_URI = f"mysql+pymysql://{DB_USERNAME}:%s@{DB_HOST}:{DB_PORT}/login"% quote(DB_PASSWORD)
# STORE_DB_URI = f"sqlite:///{path}\login.db"

class Config:
    DEBUG = True
    JWT_ALGORITHM = "RS256"
    SECRET_KEY = "secret"
    JWT_SECRET_KEY = _JWT_SECRET_KEY
    JWT_PRIVATE_KEY = _JWT_PRIVATE_KEY
    JWT_PUBLIC_KEY = _JWT_PUBLIC_KEY
    
    UPLOAD_FILE = "UPLOAD_FILE"
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=365)
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=365)

    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
    JWT_IDENTITY_CLAIM = "identity"

    # Only allow https
    JWT_COOKIE_SECURE = False
    JWT_ERROR_MESSAGE_KEY = "message"
    SQLALCHEMY_DATABASE_URI = STORE_DB_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask mail
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = "*********"
    MAIL_PASSWORD = "****"
    CORS_HEADERS = "Content-Type"
    STATIC_FOLDER = "static"
    
class DevelopmentConfig(Config):
    DEBUG = True
    BACKEND_URL = "http://localhost:5050"
    
class ProductionConfig(Config):
    DEBUG = False

config_by_name = dict(
    dev=DevelopmentConfig,
    prod=ProductionConfig,
    server=ProductionConfig
)