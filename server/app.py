from flask import Flask, render_template, send_from_directory
from werkzeug.serving import run_simple

STATIC_FOLDER = '../client/build'

app = Flask(__name__, static_folder = STATIC_FOLDER)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/static/css/<path:path>')
def css_endpoint(path):
    return send_from_directory(STATIC_FOLDER + '/static/css/', path)

@app.route('/static/js/<path:path>')
def js_endpoint(path):
    return send_from_directory(STATIC_FOLDER + '/static/js/', path)

@app.errorhandler(404)
def not_found():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    run_simple('localhost', 5000, app, use_reloader=True, use_debugger=True)
