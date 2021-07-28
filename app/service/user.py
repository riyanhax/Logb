from app.controller import not_found, user
# from app.service import response, bad_request
from werkzeug.security import generate_password_hash, check_password_hash, gen_salt
from flask_jwt_extended import get_current_user
from app.service import *
from app import db
from app.model import User as UserModel, Code
from sqlalchemy import or_
import logging
import datetime

logger = logging.getLogger('login.app')

class User():
    def __init__(self) -> None:
        pass

    def to_json(user):
        return {
            "id": user.id,
            "verification": user.verification,
            "phone_number": user.phone_number,
            "role_id": user.role_id,
            "user_name": user.user_name,
            "code": user.code if user.code else '',
            "name_app": user.name_app,
            "signup_date": user.signup_date.strftime("%Y-%m-%d %H:%M:%S") if user.signup_date else '' 
        }
    

    @staticmethod
    def register_user(data):
        # try:
        phone_number = data.get('phone_number')
        password = data.get('password')
        user_name = data.get('user_name')
        imgID = data.get('imgID')
        code = data.get('code', '')
        date = datetime.datetime.now()

        if len(password) < 8 or len(user_name) < 8:
            return bad_request("Username and Password must be at least 8 characters.")

        password = generate_password_hash(password, method='sha256')
        user = db.engine.execute(f"SELECT * FROM user WHERE user_name='{user_name}' OR phone_number='{phone_number}'").first()

        if not user:
            if code:
                code = generate_password_hash(code, method='sha256')
                ret = db.engine.execute(f"""INSERT INTO user (password, phone_number, user_name, name_app, code, is_active, signup_date, role_id) 
                        VALUES ('{password}','{phone_number}', '{user_name}', '{imgID}', '{code}',  '1', '{date}', '3') """)
            else:
                ret = db.engine.execute(f"""INSERT INTO user (password, phone_number, user_name, name_app, is_active, signup_date, role_id) 
                        VALUES ('{password}','{phone_number}', '{user_name}', '{imgID}',  '1', '{date}', '3') """)
            
            user = {
            "id": ret.lastrowid,
            "verification": 0,
            "phone_number": phone_number,
            "role_id": 3,
            "user_name": user_name,
            "code": code,
            "name_app": imgID,
            "signup_date": date.strftime("%Y-%m-%d %H:%M:%S")
            }
            return response(user)
        else:
            return bad_request("Phone number or user name already exists.")
        # except:
        #     return bad_request()
    
    @staticmethod
    def get_user_by_id(id):
        try:
            current_user = get_current_user()
            if current_user.role_id == 1 or current_user.id == id:
                user = UserModel.query.get(id)
                if not user:
                    return not_found("User not found.")
                return response(user.to_json())
            else:
                return bad_request("Permission denied.")
        except Exception as e:
            return bad_request(e)

    @staticmethod
    def get_user_info():
        current_user = get_current_user()
        return response(current_user.to_json())

    @staticmethod
    def get_all_user():
        logger.info("function -------get_all_user-------")
        ret = db.engine.execute(f"""SELECT * FROM user WHERE role_id != '1' """).fetchall()
        user_all = [User.to_json(u) for u in ret]
        logger.info("all_user %s" %len(user_all))
        logger.info("all_user %s" %user_all)

        return response(user_all)

    @staticmethod
    def delete_user(data):
        logger.info("function -------delete_user-------")
        try:
            user_id = data.get('user_id')
            db.engine.execute(f"DELETE FROM user WHERE user.id = '{user_id}'")
            logger.info("Done")
            return response()
        except:
            logger.info("False")
            return bad_request()
            
    @staticmethod
    def add_code(data):
        try:
            logger.info("function -------add_code-------")
            user_id = data.get("user_id")
            code = data.get("code")
            logger.info("code %s" %(code))
            logger.info("user_id %s" %(user_id))
            code = generate_password_hash(str(code), method='sha256')
            db.engine.execute(f"UPDATE user SET code='{code}' WHERE id='{user_id}'") 
            logger.info("Success")
            return response()
        except:
            return bad_request()
    
    @staticmethod
    def update_password(data):
        try:
            current_user = get_current_user()
            current_password = data.get('current_password')
            new_password = data.get('new_password')

            if check_password_hash(current_user.password, current_password) is not True:
                return bad_request("Current password is not correct.")
            elif len(new_password) < 8:
                return bad_request("Password must be at least 8 characters.")
            else:
                new_password = generate_password_hash(new_password, method='sha256')
                current_user.password = new_password
                db.session.commit()
                return response("Success")
        except Exception as e:
            return bad_request(e)

    
    @staticmethod
    def forgot_password(data):
        try:
            email = data.get("email")
            user = UserModel.query.filter_by(email=email)
            if not user:
                return bad_request("Email doesn't exist in our database.")
            username = "{} {}".format(str(user.first_name), str(user.last_name))
            code = gen_salt(48)
            model = Code(code=code, user_id = user.id)
            db.session.add(model)
            db.session.commit()

            # Config your email
            # Utils.send_password(email, username, code)
            return response("Success")
        except Exception as e:
            return bad_request()