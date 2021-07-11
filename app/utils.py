from app import config
from app import mail
from app.config import config_by_name, BOILERPLATE_ENV

from flask_mail import Message

config = config_by_name[BOILERPLATE_ENV]

class Utils():
    def __init__(self) -> None:
        pass

    def send_mail(email, username, code):
        msg = Message('App - Confirm your email', sender="duckhanh250296@gmail.com", recipients=[email])
        msg.html = """<p>Dear {}</p>
        <p>Thank you for registering with App.</p>

        <p>Please click on the link below to complete your registration:<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<a href='{}/confirm_email?code={}'>Confirm your email</a>.</p>

        <p>If you did not initiate this confirmation, you may safely ignore this email.</p></br>
        <p>Sincerely,</p>
        <p>App Team</p>""".format(username, config.BACKEND_URL, code)
        mail.send(msg)

    def send_password(email, username, code):
        link = f"{config.BACKEND_URL}/reset?code={code}"
        msg = Message('APP - Reset your password', sender="duckhanh250296@gmail.com", recipients=[email])
        msg.html = """<p>Dear {}</p>
        <p>We received a request to reset your password. Please click the link below to reset your password.</p>
        <a href="{}">Reset password</a>
        <p>If you didn't request this, you can ignore this email and let us know if you are concerned.</p>
        <br/>
        App Team""".format(username, link)
        mail.send(msg)


