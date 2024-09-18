from app import create_app
import os


if __name__ == "__main__":
    host = os.environ.get("FLASK_RUN_HOST")
    port = os.environ.get("FLASK_RUN_PORT")
    debug = os.environ.get("FLASK_DEBUG")
    app = create_app()
    app.run(debug=debug, host=host, port=port)
