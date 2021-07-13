import time
from app import db
# Define the Role data-model
class Role(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(50), unique=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    verification = db.Column(db.Boolean, default=False)
    
    # User fields
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), default=3)
    password2 = db.Column(db.String(255), nullable=False)
    user_name = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.email
    
    def to_json(self):
        return {
            "id": self.id,
            "email": self.email,
            "verification": self.verification,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role_id": self.role_id,
            "user_name": self.user_name
        }

class Code(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(255), nullable=False, unique=True)
    code_time = db.Column(db.Integer,  nullable=False, default=lambda: int(time.time()))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))

    def is_expired(self):
        return self.code_time + 3600 < time.time()
