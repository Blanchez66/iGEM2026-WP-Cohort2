from os import path
import os
from pathlib import Path

from flask import Flask, render_template, abort

template_folder = path.abspath('./wiki')

app = Flask(__name__, template_folder=template_folder)

@app.route('/')
def home():
    return render_template('pages/home.html')

@app.route('/<page>/')
def pages(page):
    page_name = page.lower() + '.html'
    # We are looking for the page in the 'pages' subdirectory of the template folder
    search_dir = os.path.join(app.template_folder, 'pages')
    for root, dirs, files in os.walk(search_dir):
        if page_name in files:
            # Construct the path relative to the template folder for render_template
            full_path = os.path.join(root, page_name)
            template_path = os.path.relpath(full_path, app.template_folder)
            # Ensure forward slashes for the template path
            template_path = template_path.replace('\\', '/')
            return render_template(template_path)
    # If the page is not found, return a 404 error
    abort(404)

# Main Function, Runs at http://0.0.0.0:8080
if __name__ == "__main__":
    app.run(port=8080, debug=True)
