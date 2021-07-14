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
    conn = sqlite3.connect(db_file)
    cur = conn.cursor()
    
    find_or_create_roles(cur, "admin")
    find_or_create_roles(cur, "user")
    conn.commit()
    conn.close()
    # find_or_create_roles("user")
    # find_or_create_admin()
    # db.session.commit()

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