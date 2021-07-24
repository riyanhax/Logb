import os.path
from flask import Blueprint, render_template, session
from flask.helpers import url_for
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
# from flask_jwt_extended.utils import get_current_user
# from flask_jwt_extended.view_decorators import jwt_required
from werkzeug.utils import redirect
# from app.service.user import User

view_blp = Blueprint("view", __name__)

@view_blp.route("/")
def index():
    return render_template("index.html")
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
    if session["user_name"]:
        return render_template("profile.html")
    else:
        return redirect(url_for("view.login"))
    # try:
    #     verify_jwt_in_request()
    #     idt = get_jwt_identity()
    #     id_ = idt.get("id", -1)
    #     user = User.get_user_by_id(id_)
    #     if user:
    #         return render_template("profile.html")
    #     else:
    #         redirect(url_for("view.login"))
    # except:
    #     return redirect(url_for("view.login"))

# @view_blp.route('/verify')
# def verify():
#     return render_template("verify.html")

@view_blp.route('/login/<data_id>')
def login(data_id):
    return render_template('login.html', img_name = data_id)

@view_blp.route('/signup/<data_id>')
def signup(data_id):
    return render_template('signup.html', img_name = data_id)

@view_blp.route('/admin')
def admin():
    return render_template('admin.html')