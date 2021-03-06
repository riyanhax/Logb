# from flask.helpers import url_for
# from werkzeug.utils import redirect
from app.service import *
from app import jwt
from werkzeug.security import check_password_hash
from flask_jwt_extended import (create_access_token, create_refresh_token, get_jwt)
from app.utils import MessType
from flask import session
from app import db
# from flask_jwt_extended import get_current_user
from sqlalchemy import and_
import logging

logger = logging.getLogger('login.app')


@jwt.user_identity_loader
def load_user(identity):
    # print("identity: ", identity)
    return identity

@jwt.user_lookup_loader
def user_lookup_callback(jwt_header, jwt_data):
    # print("jwt: ", jwt_data)
    id = jwt_data["identity"]
    user = find_user_by_id(id)
    return user

@jwt.user_lookup_error_loader
def custom_user_loader_error(identity):
    return bad_request("User not found.")

class Auth():
    def __init__(self) -> None:
        pass

    def admin_authorize(data):
        try:
            logger.info("function -------admin_authorize-------")
            user_name = data.get("user_name")
            password = data.get("password")
            logger.info("user_name %s" %user_name)
            logger.info("password %s" %password)

            user = db.engine.execute(f"SELECT * FROM user WHERE user_name = '{user_name}' AND role_id='1'").first()
            # user = UserModel.query.filter_by(user_name=user_name, role_id = 1).first()
            logger.info("user %s" %user)
            if not user:
                return bad_request(MessType.USERERR)
            if user.password is None or not check_password_hash(user.password, str(password)):           
                return bad_request(MessType.USERERR)
            
            session.permanent = False
            session["user_name"] = user_name
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            res = {
                "access_token": access_token,
                "refresh_token": refresh_token
            }
            logger.info("Succes")
            return response(res)   
        except:
            logger.info("except request")
            return bad_request()

    def authorize(data):
        try:
            logger.info("function -------authorize-------")
            user_name = data.get("user_name")
            password = data.get("password")
            code = data.get("code")
            name_app = data.get("imgID")

            logger.info("user_name %s" %user_name)
            logger.info("password %s" %password)
            logger.info("code %s" %code)
            logger.info("name_app %s" %name_app)

            user = db.engine.execute(f"""SELECT * FROM user 
                                    WHERE user_name = '{user_name}' AND role_id != '1' AND name_app = '{name_app}' """).first()
            # user = UserModel.query.filter(and_(UserModel.user_name==user_name, UserModel.role_id != 1, UserModel.name_app == name_app)).first()
            logger.info("user %s " %user)
            if not user:
                return bad_request(MessType.USERERR)
            if user.password is None or not check_password_hash(user.password, str(password)):           
                return bad_request(MessType.USERERR)
            if not code or not check_password_hash(user.code, code):
                return bad_request(MessType.CODEERR)
            
            session.permanent = False
            session["user_name"] = user_name
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            res = {
                "access_token": access_token,
                "refresh_token": refresh_token
            }
            # print("res: ", res)
            logger.info("Success %s ")
            return response(res)   
        except Exception as e:
            logger.info("except request")
            print(e)
            return bad_request(MessType.USERERR)

    def verify(data):
        try:
            password = data.get("password")
            user_name = session.get("user_name")
            print(user_name)
            if not user_name:
                return bad_request("Invalid email!")
            user = UserModel.query.filter_by(email=user_name).first()
            # current_user = get_current_user()
            if user.password2 is None or not check_password_hash(user.password2, password):           
                return bad_request("Wrong email or password.")
            
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)   
            res = {
                "user_name": user.user_name,
                "access_token": access_token,
                "refresh_token": refresh_token
            }
            print("res: ", res)
            return response(res)
        except:
            return bad_request("Invalid password!")

    # def logout():
    #     try:
    #         session.pop("email", None)
    #         return response()
    #     except:
    #         return bad_request("Request fail")