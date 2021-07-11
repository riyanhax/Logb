from . import auth_blp
from flask import request, redirect, url_for
from app.service.auth import Auth


@auth_blp.route("", methods = ["POST"])
def authorize():
    data = request.json
    return Auth.authorize(data)
