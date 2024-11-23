from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configure the PostgreSQL database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://kriti@127.0.0.1:5432/poc'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define a model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(80), nullable=False)
    color = db.Column(db.Integer)
    status = db.Column(db.Integer, nullable=False, default=3)

class Color(db.Model):
    code = db.Column("code",db.Integer, primary_key=True)
    color = db.Column(db.String(80), nullable=False)

class Status(db.Model):
    code = db.Column("code",db.Integer, primary_key=True)
    status = db.Column(db.String(80), nullable=False)
    
@app.route('/')
def home():
    return "Hello, World!"

@app.route('/tasks', methods=['GET'])
@cross_origin()
def get_tasks():
    try:
        tasks = Task.query.all()
        task_list = [{'id': task.id, 'text': task.text, 'color': task.color, 'status': task.status} for task in tasks]
        return jsonify(task_list)
    except Exception as e:
        return(jsonify({'error': str(e)}), 500)

@app.route('/tasks', methods=['POST'])
@cross_origin()
def post_tasks():
    # get the task details from the request
    new_task = request.get_json()
    # create a new task object
    task = Task(text=new_task['text'])
    # add the task object to the database
    db.session.add(task)
    # commit the changes to the database
    db.session.commit()
    # return a success message
    db.session.refresh(task)
    return jsonify({
        'message': 'Task added successfully',
        'inserted': {
            'id': task.id, 'text': task.text, 
            'color': task.color, 'status': task.status}})

@app.route('/task/color', methods=['PUT'])
@cross_origin()
def put_task_color():
    # get the task details from the request
    try:
        task_to_update = request.get_json()
        db.session.query(Task).filter(
            Task.id == task_to_update['task_id']).update(
                {Task.color: task_to_update['color']})
        # commit the changes to the database
        db.session.commit()
        return jsonify({
            'message': 'Task updated successfully',
            'inserted': {
                'id': task_to_update['task_id'],
                'color': task_to_update['color']}})
    except Exception as e:
        return(jsonify({'error': str(e)}), 400)

@app.route('/task/status', methods=['PUT'])
@cross_origin()
def put_task_status():
    # get the task details from the request
    task_to_update = request.get_json()
    db.session.query(Task).filter(
        Task.id == task_to_update['task_id']).update(
            {Task.status: task_to_update['status']})
    # commit the changes to the database
    db.session.commit()
    return jsonify({
        'message': 'Task updated successfully',
        'inserted': {
            'id': task_to_update['task_id'],
            'status': task_to_update['status']}})

@app.route('/task', methods=['DELETE'])
@cross_origin()
def delete_task():
    # get the task details from the request
    task_to_delete = request.get_json()
    db.session.query(Task).filter(
        Task.id == task_to_delete['task_id']).delete()
    # commit the changes to the database
    db.session.commit()
    return jsonify({
        'message': 'Task deleted successfully',
        'inserted': {
            'id': task_to_delete['task_id']}})
    
@app.route('/colors', methods=['GET'])
@cross_origin()
def get_colors():
    colors = Color.query.all()
    colors_list = [{'id': color.code, 'color': color.color} for color in colors]
    return jsonify(colors_list)

@app.route('/status', methods=['GET'])
@cross_origin()
def get_status():
    try:
        status = Status.query.all()
        status_list = [{'id': s.code, 'status': s.status} for s in status]
        return jsonify(status_list)
    except Exception as e:
        return(jsonify({'error': str(e)}), 500)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
