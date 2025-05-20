from flask import Flask, send_from_directory, abort
import os

app = Flask(__name__)

@app.route("/<int:number>")
def download(number):
    if 1 <= number <= 20:  # Expanded range to include all files
        file_dir = os.path.join(os.path.dirname(__file__), "files")
        filename = f"{number}.ino"
        file_path = os.path.join(file_dir, filename)
        if os.path.exists(file_path):
            return send_from_directory(directory=file_dir, path=filename, as_attachment=True, download_name=f"Code_{number}.ino")
    abort(404)

@app.route("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
