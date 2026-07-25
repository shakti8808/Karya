from __future__ import annotations

import sys
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, render_template

MINIMUM_PYTHON = (3, 10)
if sys.version_info < MINIMUM_PYTHON:
    required = ".".join(map(str, MINIMUM_PYTHON))
    raise RuntimeError(f"Karya requires Python {required} or newer.")

BASE_DIR = Path(__file__).resolve().parent
app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR / "static"),
)


@app.context_processor
def shared_template_values() -> dict[str, int]:
    return {"current_year": datetime.now(timezone.utc).year}


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/about")
def about():
    return render_template("about.html")


@app.get("/pricing")
def pricing():
    return render_template("pricing.html")



@app.get("/early-access")
def early_access():
    return render_template("early-access.html")


@app.get("/login")
def login():
    return render_template("auth.html")


@app.get("/app")
def workspace():
    return render_template("workspace.html")


@app.get("/health")
def health():
    return jsonify(status="ok", service="karya-web")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5002, debug=True)
