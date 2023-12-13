#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource
from flask import make_response, request, session

# Local imports
from config import app, db, api
# Add your model imports
from models import Owner, Clothes, Review

# Views go here!

class Login(Resource):
    def post(self):
        username = request.json["username"]
        user = Review.query.filter_by(username=username).first()

        password = request.json["password"]

        if user.authenticate(password):
            session["user_id"] = user.id
            return user.to_dict()
        
        return make_response({"error" : "Incorrect username or password"}, 401)
    
api.add_resource(Login, '/login')

class Signup(Resource):
    def post(self):
        data = request.json
        user = Review(first_name=data['firstName'], last_name=data['lastName'], email=data['email'], username=data['username'], password_hash=data['password'])
        db.session.add(user)
        db.session.commit()
        return make_response(user.to_dict(), 200)
    
api.add_resource(Signup, '/signup')

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

