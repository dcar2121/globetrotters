# app.py - Flask backend
from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tripplanner.db'
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)

# Define database models for Users, Destinations, Budgets, Itineraries, Tasks

@app.route('/')
def index():
    return render_template('index.html')

# Add routes for account management, destination research, budget planning, itinerary creation, and task management

if __name__ == '__main__':
    app.run(debug=True)
