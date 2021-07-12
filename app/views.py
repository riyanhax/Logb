import os.path
from flask import Blueprint, render_template, send_from_directory
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.service.user import User

view_blp = Blueprint("view", __name__)

@view_blp.route("/")
def index():
    return render_template("base.html")
    # print (1)
    # try:
    # verify_jwt_in_request()
    # idt = get_jwt_identity()
    # id_ = idt.get("id", -1)
    # user = User.get_user_by_id(id_)
    # if user:
    #     return render_template("profile.html")
    # else:
    #     return render_template("login.html")
    # except:
    #     return render_template("login.html")

@view_blp.route('/profile')
def profile():
    return render_template("profile.html")
    # try:
    # verify_jwt_in_request()
    # idt = get_jwt_identity()
    # id_ = idt.get("id", -1)
    # user = User.get_user_by_id(id_)
    # if user:
    #     return render_template("profile.html")
    # else:
    #     return render_template("login.html")
    # except:
    #     return render_template("login.html")

@view_blp.route('/verify')
def verify():
    return render_template("verify.html")

@view_blp.route('/login')
def login():
    return render_template('login.html')

@view_blp.route('/signup')
def signup():
    return render_template('signup.html')