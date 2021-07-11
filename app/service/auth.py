from app.service import *
from app import jwt
from werkzeug.security import check_password_hash
from flask_jwt_extended import (create_access_token, create_refresh_token)


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
        user_name = data.get("user_name")
        password = data.get("password1")
        user = UserModel.query.filter_by(email=user_name).first()
        if not user:
            return {"status": "warning", "message": "Email doesn't exist in our database."}
        if user.password is None or not check_password_hash(user.password, password):           
            return {"status": "warning", "message": "Wrong email or password."}

        # access_token = create_access_token(identity=email)
        # refresh_token = create_refresh_token(identity=email)   
        # res = {
        #     "access_token": access_token,
        #     "refresh_token": refresh_token
        # }

        return response()