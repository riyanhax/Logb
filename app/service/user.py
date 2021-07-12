from app.controller import not_found
from app.service import response, bad_request
from werkzeug.security import generate_password_hash, check_password_hash, gen_salt
from flask_jwt_extended import get_current_user
from app.service import *
from app import db
from app.model import User as UserModel, Code
from app.utils import Utils
from sqlalchemy import or_

class User():
    def __init__(self) -> None:
        pass

    @staticmethod
    def register_user(data):
        # try:
        print(1)
        email = data.get('email')
        password = data.get('password1')
        password2 = data.get('password2')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        user_name = data.get('user_name')

        print(email)
        print(password)
        print(password2)
        print(first_name)
        print(last_name)
        if len(password) < 8 or email is None:
            return bad_request("Password must be at least 8 characters.")

        password = generate_password_hash(password, method='sha256')
        password2 = generate_password_hash(password2, method='sha256')

        print(password)
        print(password2)
        user = UserModel.query.filter_by(email=email).first()
        print(user)
        if not user:
            print(1)
            user = UserModel(email=email, 
                password=password, 
                first_name= first_name, 
                last_name = last_name,
                password2=password2,
                user_name = user_name,
            )
            print(1)
            
            db.session.add(user)
            db.session.flush()
            # code = gen_salt(48)
            # model = Code(code=code, user_id = user.id)
            # db.session.add(model)
            # user_name = f"{first_name} {last_name}"
            # Utils.send_mail(email, user_name, code)
            db.session.commit()
            print(1)
            return response(user.to_json())
        else:
            print(2)
            return bad_request("Email or user name already exists.")
        # except Exception as e:
        #     print(3)
        #     return bad_request(e)
    
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