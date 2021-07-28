import logging
from flask.logging import default_handler
from flask import Flask, render_template, has_request_context, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_mail import Mail
import logging
from app.config import config_by_name, BOILERPLATE_ENV

db = SQLAlchemy()
flask_bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()
mail = Mail()

cfg = config_by_name[BOILERPLATE_ENV]

def blueprints_fabrics(app, blueprints):
    """Configure blueprints in views."""

    for blueprint in blueprints:
        app.register_blueprint(blueprint)

def error_pages(app):
    # HTTP error pages definitions
    @app.errorhandler(403)
    def forbidden_page(error):
        return render_template("misc/403.html"), 403

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template("misc/404.html"), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return render_template("misc/405.html"), 404

    @app.errorhandler(500)
    def server_error_page(error):
        return render_template("misc/500.html"), 500
    
    @app.errorhandler(401)
    def unauthorized(error):
        return render_template("singin.html")

def create_app(config_name="dev"):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    logging.basicConfig(filename='logger.log', level=logging.DEBUG, filemode='w', datefmt='%d-%b-%y %H:%M:%S')
    db.init_app(app)
    flask_bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)

    # from app.model import User, Role
    from app.controller.auth import auth_blp
    from app.controller.user import user_blp
    from app.views import view_blp

    blueprints = [auth_blp, user_blp, view_blp]
    blueprints_fabrics(app, blueprints)

    # Error page
    error_pages(app)
    init_email_error_handler(app)

    return app

class RequestFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            remote_addr = request.headers.get('X-Forwarded-For', request.remote_addr)
            record.url = request.url
            record.remote_addr = remote_addr
        else:
            record.url = None
            record.remote_addr = None

        return super().format(record)

def init_email_error_handler(app):
    """
    Initialize a logger to send emails on error-level messages.
    Unhandled exceptions will now send an email message to app.config.ADMINS.
    """
    if BOILERPLATE_ENV == "dev": return # Do not send error emails while developing

    # Flask mail
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = ""
    MAIL_PASSWORD = ""
    MAIL_DEFAULT_SENDER = '"Maxflowtech" <no-reply@maxflowtech.com>'

    # Retrieve email settings from app.config
    host = MAIL_SERVER
    port = MAIL_PORT
    from_addr = MAIL_DEFAULT_SENDER
    username = MAIL_USERNAME
    password = MAIL_PASSWORD
    secure = () if MAIL_USE_TLS else None

    # Retrieve app settings from app.config
    to_addr_list = ["dev@gmail.com"]
    subject = "MAXFLOW ERROR"

    # Setup an SMTP mail handler for error-level messages
    import logging
    from logging.handlers import SMTPHandler

    mail_handler = SMTPHandler(
        mailhost=(host, port),  # Mail host and port
        fromaddr=from_addr,  # From address
        toaddrs=to_addr_list,  # To address
        subject=subject,  # Subject line
        credentials=(username, password),  # Credentials
        secure=secure,
    )

    formatter = RequestFormatter(
        '[%(asctime)s] %(remote_addr)s requested %(url)s\n'
        '%(levelname)s in %(module)s: %(message)s'
    )
    default_handler.setFormatter(formatter)
    mail_handler.setFormatter(formatter)
    mail_handler.setLevel(logging.ERROR)
    app.logger.addHandler(mail_handler)
    logging.getLogger('werkzeug').addHandler(mail_handler)