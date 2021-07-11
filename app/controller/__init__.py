from flask import Blueprint, jsonify

auth_blp = Blueprint("Authenticate", __name__, url_prefix="/auth")
user_blp = Blueprint("User", __name__, url_prefix="/api/user")

def bad_request(message = "Invalid request."):
    return jsonify(status=False, message=str(message)), 400
    
def response(data = None, status = True):
    return jsonify(status=status, data = data)

def not_found(message = "Not found."):
    return jsonify(status="fail", message = message), 404