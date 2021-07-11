from flask import jsonify
from app.model import User as UserModel

def bad_request(message = "Invalid request."):
    return jsonify(status="Bad request.", message=str(message)), 400
    
def response(data = None):
    return jsonify(data)

def find_user_by_email(email):
    user = UserModel.query.filter_by(email=email).first()
    return user
