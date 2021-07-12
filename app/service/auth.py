from flask.helpers import url_for
from werkzeug.utils import redirect
from app.service import *
from app import jwt
from werkzeug.security import check_password_hash
from flask_jwt_extended import (create_access_token, create_refresh_token, get_current_user)
from flask import session
# from flask_jwt_extended import get_current_user



@jwt.user_identity_loader
def load_user(identity):
    return identity

@jwt.user_lookup_loader
def user_lookup_callback(jwt_header, jwt_data):
    email = jwt_data["identity"]
    user = find_user_by_email(email)
    return user

@jwt.user_lookup_error_loader
def custom_user_loader_error(identity):
    return bad_request("User not found.")

class Auth():
    def __init__(self) -> None:
        pass

    def authorize(data):
        try:
            email = data.get("email")
            password = data.get("password1")
            user = UserModel.query.filter_by(email=email).first()
            session["email"] = email
            if not user:
                return bad_request("Email doesn't exist in our database.")
            if user.password is None or not check_password_hash(user.password, password):           
                return bad_request("Wrong email or password.")

            return response()
        except Exception as e:
            print(e)
            return bad_request("Email or password incorrect!")

    def verify(data):
        try:
            password = data.get("password")
            email = session.get("email")
            print(email)
            if not email:
                return bad_request("Invalid email!")
            user = UserModel.query.filter_by(email=email).first()
            # current_user = get_current_user()
            if user.password2 is None or not check_password_hash(user.password2, password):           
                bad_request("Wrong email or password.")
            
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)   
            res = {
                "user_name": user.user_name,
                "access_token": access_token,
                "refresh_token": refresh_token
            }
            return response(res)
        except Exception as e:
            print(e)
            return bad_request("Invalid password!")