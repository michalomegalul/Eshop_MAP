import atexit
import os
from flask import Flask, url_for, render_template
import logging
from flask_migrate import Migrate
from flask_login import LoginManager
from .views import jwt
import stripe
from .models import bcrypt, db
from flask_cors import CORS

# Inicializace rozšíření


def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def create_app():
    template_path = os.path.abspath("app/templates")
    app = Flask(__name__, template_folder=template_path)  # Initialize the Flask app
    CORS(app, origins="http://localhost:9090")

    # Set up Stripe API keys from environment variables
    stripe.api_key = os.getenv('STRIPE_SECRET_KEY')  # Secret key for backend
    app.config['STRIPE_PUBLIC_KEY'] = os.getenv('STRIPE_PUBLIC_KEY')  # Public key for frontend

    app.config.from_object("config.Config")
    print(app.config)

    # Inicializace rozšíření
    template_path = os.path.abspath("app/templates")
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    logging.basicConfig(level=logging.DEBUG)
    app.logger.setLevel(logging.DEBUG)
    login_manager = LoginManager()
    Migrate(app, db) 
    login_manager.init_app(app)
    login_manager.login_view = "login"
    print("logging in")
    print("DB INITIALIZED migrations")

    # Run migrations on startup
    with app.app_context():
        try:
            from flask_migrate import upgrade
            upgrade()  # Apply migrations
            print("Database migrations applied successfully.")
        except Exception as e:
            print(f"Failed to apply migrations: {e}")

    # Register the blueprint for your API routes
    from .views import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")
    @app.route('/')
    def home():
        # Render the home page base.html
        return render_template("base.html")

    @app.route("/site-map")
    def site_map():
        links = []
        for rule in app.url_map.iter_rules():
            if "GET" in rule.methods and has_no_empty_params(rule):
                url = url_for(rule.endpoint, **(rule.defaults or {}))
                links.append((url, rule.endpoint))
        return {"links": links}

    return app

app = create_app()
