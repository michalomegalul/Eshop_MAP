import atexit
import os
from flask import Flask, url_for, request, jsonify
import logging
from flask_migrate import Migrate
from .views import jwt
import stripe
from .models import bcrypt, db
from flask_cors import CORS
# Inicializace rozšíření


# def has_no_empty_params(rule):
#     defaults = rule.defaults if rule.defaults is not None else ()
#     arguments = rule.arguments if rule.arguments is not None else ()
#     return len(defaults) >= len(arguments)


def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173", "http://localhost:8000"], supports_credentials=True)

    # Set up Stripe API keys from environment variables
    stripe.api_key = os.getenv('STRIPE_SECRET_KEY')  # Secret key for backend
    print("STRIPE SECRET KEY")
    print(os.getenv('STRIPE_SECRET_KEY'))
    # app.config['STRIPE_PUBLIC_KEY'] = os.getenv('STRIPE_PUBLIC_KEY')  # Public key for frontend

    # @app.before_request
    # def log_request_info():
    #     app.logger.debug(f"Request Method: {request.method}")
    #     app.logger.debug(f"Request URL: {request.url}")
    #     app.logger.debug(f"Request Headers: {dict(request.headers)}")
    #     app.logger.debug(f"Request Body: {request.get_data()}")
    #     app.logger.debug(f"Request JSON: {request.get_json()}")
        

    app.config.from_object("config.Config")
    print(app.config)
    


    # Inicializace rozšíření
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
    app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token'
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["JWT_CSRF_CHECK_FORM"] = True  
    Migrate(app, db) 
    print("logging in")
    print("DB INITIALIZED migrations")
    # @metrics.counter('custom_endpoint_counter', 'Counts accesses to the custom endpoint')
    # @app.route('/custom')
    # def custom_endpoint():
    #     return "This is a custom endpoint!"
    # # Run migrations on startup
    with app.app_context():
        try:
            from flask_migrate import upgrade
            upgrade()  # Apply migrations
            print("Database migrations applied successfully.")
        except Exception as e:
            print(f"Failed to apply migrations: {e}")

        # Register the blueprint for your API routes
    @app.errorhandler(Exception)
    def handle_exception(e):
        app.logger.exception("An unhandled exception occurred: %s", e)
        # Optionally, return a JSON error message:
        response = jsonify({"error": "Internal Server Error", "message": str(e)})
        response.status_code = 500
        return response

    from .views import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")
    
    # @app.route("/site-map")
    # def site_map():
    #     links = []
    #     for rule in app.url_map.iter_rules():
    #         if "GET" in rule.methods and has_no_empty_params(rule):
    #             url = url_for(rule.endpoint, **(rule.defaults or {}))
    #             links.append((url, rule.endpoint))
    #     return {"links": links}

    return app

app = create_app()
