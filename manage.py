import sqlite3
from sqlite3 import Error
from app import create_app
# from flask_script import Manager
# from flask_migrate import MigrateCommand
from app import db
import sys
import os

from urllib.parse import quote
from sqlalchemy import create_engine, engine



base_path = os.getcwd()


DB_USERNAME = os.environ.get("DB_USERNAME", "admin")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "Coca@Pizza123")
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", 3306)

STORE_DB_URI = f"mysql+pymysql://{DB_USERNAME}:%s@{DB_HOST}:{DB_PORT}/login"% quote(DB_PASSWORD)
engine = create_engine(STORE_DB_URI)

import pymysql


# def seed():
#     # conn = sqlite3.connect(db_file)
#     print(DB_PORT)
#     conn  = pymysql.connect(
#     host=DB_HOST,
#     user=DB_USERNAME, 
#     port = DB_PORT,
#     password = DB_PASSWORD,
#     db='login',
#     )

    
#     cur = conn.cursor()
#     find_or_create_roles(cur, "admin")
#     find_or_create_roles(cur, "user")
#     conn.commit()
#     conn.close()

def admin():

    from werkzeug.security import generate_password_hash
   
    user_name = "admin_trader"
    password = generate_password_hash("trader_pwd", method='sha256')
    engine.execute(f"INSERT INTO user(id, user_name, password, role_id, is_active) VALUES('1', '{user_name}', '{password}', '1', '1')")


def find_or_create_roles(cur, role_name):
    # role = Role.query.filter_by(name=role_name).first()
    # if not role:
    #     role = Role(name=role_name)
    #     db.session.add(role)
    cur.execute(f"SELECT * FROM Role WHERE name ='{role_name}'")
    if not cur.fetchall():
        cur.execute(f"INSERT INTO Role(name) VALUES('{role_name}')")
    


# def create_connection(db_file):
#     """ create a database connection to a SQLite database """
#     conn = None
#     try:
#         conn = sqlite3.connect(db_file)
#         print(sqlite3.version)
#     except Error as e:
#         print(e)
#     finally:
#         if conn:
#             conn.close()


if __name__ == '__main__':
    args = sys.argv
    globals()[args[1]](*args[2:])
    # manager.run()