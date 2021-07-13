from . import auth_blp
from flask import request, redirect, url_for
from flask_jwt_extended import jwt_required
from app.service.auth import Auth


@auth_blp.route("/login", methods = ["POST"])
def authorize():
    data = request.json
    return Auth.authorize(data)

@auth_blp.route("/verify", methods = ["POST"])
def verify():
    data = request.json
    return Auth.verify(data)

@auth_blp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    return Auth.logout()