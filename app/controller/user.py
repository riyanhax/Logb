from flask import request
from app.service.user import User
from flask_jwt_extended import jwt_required
from . import response, user_blp

@user_blp.route("/me", methods = ["GET"])
@jwt_required()
def info():
    return User.get_user_info()

@user_blp.route("/<int:id>", methods = ["GET"])
@jwt_required()
def get(id):
    return User.get_user_by_id(id)

@user_blp.route("/register", methods = ["POST"])
def register():
    # print (request.json)
    data = request.json
    return User.register_user(data)

@user_blp.route("/update_password", methods= ["POST"])
@jwt_required()
def change_password():
    data = request.json
    return User.update_password(data)

@user_blp.route("/all_user", methods = ["GET"])
@jwt_required()
def all_user():
    return User.get_all_user()

@user_blp.route("/me", methods = ["DELETE"])
@jwt_required()
def delete_user():
    data = request.json
    return User.delete_user(data)

@user_blp.route("/code", methods = ["PUT"])
@jwt_required()
def add_code():
    data = request.json
    return User.add_code(data)

    