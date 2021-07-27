import sqlite3
from sqlite3 import Error
from app import create_app
# from flask_script import Manager
# from flask_migrate import MigrateCommand
from app import db
import sys
import os

from app.model import Role
base_path = os.getcwd()
db_file = f"{base_path}\\login.db"

DB_USERNAME = os.environ.get("DB_USERNAME", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "11111111")
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", 3306)

import pymysql


def create_connection():
    """ create a database connection to a SQLite database """
    conn = None
    try:
        
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

def seed():
    # conn = sqlite3.connect(db_file)
    print(DB_PORT)
    conn  = pymysql.connect(
    host=DB_HOST,
    user=DB_USERNAME, 
    port = DB_PORT,
    password = DB_PASSWORD,
    db='login',
    )

    
    cur = conn.cursor()
    find_or_create_roles(cur, "admin")
    find_or_create_roles(cur, "user")
    conn.commit()
    conn.close()
    # find_or_create_roles("user")
    # find_or_create_admin()
    # db.session.commit()

def admin():
    from werkzeug.security import generate_password_hash, check_password_hash, gen_salt
    conn  = pymysql.connect(
    host=DB_HOST,
    user=DB_USERNAME, 
    port = DB_PORT,
    password = DB_PASSWORD,
    db='login',
    )
    cur = conn.cursor()
    user_name = "admin_trader"
    password = generate_password_hash("trader_pwd", method='sha256')
    cur.execute(f"INSERT INTO User(id, user_name, password, role_id, is_active) VALUES('1', '{user_name}', '{password}', '1', '1')")
    conn.commit()
    conn.close()

# def addUser():
#     from werkzeug.security import generate_password_hash, check_password_hash, gen_salt
#     conn = sqlite3.connect(db_file)
#     cur = conn.cursor()
#     user_name = ['admain_trader %s' %i for i in range(1000)]
#     password = [generate_password_hash("11223344", method='sha256') for i in range(1000)]
#     code = [generate_password_hash("11223344", method='sha256') for i in range(1000)]
#     is_active = ['1' for i in range(1000)]
#     name_app = ['kitanex' for i in range(1000)]
#     print(type(','.join(user_name)))
#     cur.execute(f"INSERT INTO user(user_name, password, code, is_active, name_app) VALUES ({','.join(user_name)}), ({password}), ({code}), ({is_active}), ({name_app})")
#     conn.commit()
#     conn.close()


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