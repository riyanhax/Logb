import time
from app import db
import datetime
# Define the Role data-model
class Role(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(255), nullable=True)
    password = db.Column(db.String(255), nullable=False)
    verification = db.Column(db.Boolean, default=False)
    code = db.Column(db.String(255), nullable=True, unique=True)

    # User fields
    is_active = db.Column(db.Boolean, nullable=False, default=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), default=3)
    name_app = db.Column(db.String(255), nullable=True)
    signup_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def __repr__(self):
        return '<user_name %r>' % self.user_name
    
    def to_json(self):
        return {
            "id": self.id,
            "verification": self.verification,
            "phone_number": self.phone_number,
            "role_id": self.role_id,
            "user_name": self.user_name,
            "code": self.code,
            "name_app": self.name_app,
            "signup_date": self.signup_date.strftime("%Y-%m-%d %H:%M:%S")
        }

class Code(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(255), nullable=False, unique=True)
    code_time = db.Column(db.Integer,  nullable=False, default=lambda: int(time.time()))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))

