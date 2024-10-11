import atexit
from flask import Flask, url_for
from flask_migrate import Migrate, upgrade
from .models import db


def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")
    print(app.config)

    db.init_app(app)
    Migrate(app, db)
    print("DB INITIALIZED migrations")

    # Run migrations on startup
    with app.app_context():
        try:
            upgrade()
            print("Database migrations applied successfully.")
        except Exception as e:
            print(f"Failed to apply migrations: {e}")


    # Register the blueprint
    from .views import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    @app.route("/site-map")
    def site_map():
        links = []
        for rule in app.url_map.iter_rules():
            if "GET" in rule.methods and has_no_empty_params(rule):
                url = url_for(rule.endpoint, **(rule.defaults or {}))
                links.append((url, rule.endpoint))
        return {"links": links}

    # @app.route("/ping", methods=["GET"])
    # def ping():
    #     return "pong"

    return app


app = create_app()
