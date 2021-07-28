from app.controller import not_found, user
# from app.service import response, bad_request
from werkzeug.security import generate_password_hash, check_password_hash, gen_salt
from flask_jwt_extended import get_current_user
from app.service import *
from app import db
from app.model import User as UserModel, Code
from sqlalchemy import or_
import logging

logger = logging.getLogger('login.app')

class User():
    def __init__(self) -> None:
        pass

    @staticmethod
    def register_user(data):
        # try:
        phone_number = data.get('phone_number')
        password = data.get('password')
        user_name = data.get('user_name')
        imgID = data.get('imgID')
        code = data.get('code', '')

        if len(password) < 8 or len(user_name) < 8:
            return bad_request("Username and Password must be at least 8 characters.")

        password = generate_password_hash(password, method='sha256')
        code = generate_password_hash(code, method='sha256') if code else None
        user = UserModel.query.filter(or_(UserModel.user_name == user_name, UserModel.phone_number == phone_number)).first()

        if not user:
            user = UserModel(
                password=password, 
                phone_number= phone_number, 
                user_name = user_name,
                name_app = imgID,
                code = code
            )
            
            db.session.add(user)
            db.session.commit()
            return response(user.to_json())
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
        user_all = UserModel.query.filter(UserModel.role_id != 1).all()
        logger.info("all_user %s" %len(user_all))
        logger.info("all_user %s" %user_all)

        list_user = [user.to_json() for user in user_all]
        return response(list_user)

    @staticmethod
    def delete_user(data):
        try:
            user_id = data.get('user_id')
            user = UserModel.query.get(user_id)
            if user:
                db.session.delete(user)
                db.session.commit()
                return response(user.to_json())
            return bad_request()
        except:
            return bad_request()

    @staticmethod
    def add_code(data):
        try:
            logger.info("function -------add_code-------")
            user_id = data.get("user_id")
            code = data.get("code")
            logger.info("code %s" %len(code))
            logger.info("user_id %s" %len(user_id))

            user = UserModel.query.get(user_id)
            logger.info("user %s" %len(user))

            if user:
                code = generate_password_hash(code, method='sha256')
                user.code = code
                db.session.commit()
                return response(user.to_json())
            return bad_request()
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