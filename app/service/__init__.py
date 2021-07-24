from flask import jsonify, request, abort, make_response
from app.model import User as UserModel
import jwt
from functools import wraps
from app.constants import _JWT_SECRET_KEY

def bad_request(message = "Invalid request."):
    return jsonify(status=False, message=str(message)), 400
    
def response(data = None):
    return jsonify(status=True, data = data)

# def find_user_by_email(email):
#     user = UserModel.query.filter_by(email=email).first()
#     return user

def find_user_by_id(id):
    user = UserModel.query.get(id)
    return user

def authorize(f):
    @wraps(f)
    def decorated_function(*args, **kws):
            if not 'Authorization' in request.headers:
               abort(401)

            user = None
            data = request.headers['Authorization'].encode('ascii','ignore')
            token = str.replace(str(data), 'Bearer ','')
            try:
                user = jwt.decode(token, _JWT_SECRET_KEY, algorithms=['HS256'])['sub']
            except:
                abort(401)

            return f(user, *args, **kws)            
    return decorated_function