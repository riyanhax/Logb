import os.path
from flask import Blueprint, render_template, send_from_directory
from flask_login import login_required
view_blp = Blueprint("view", __name__)

@view_blp.route("/")
def index():
    return render_template("login.html")

@login_required
@view_blp.route('/profile')
def profile():
    print(1)
    return render_template('profile.html')

@view_blp.route('/login')
def login():
    return render_template('login.html')

@view_blp.route('/signup')
def signup():
    return render_template('signup.html')