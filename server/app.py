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
        username = request.json.get("username")
        password = request.json.get("password")

        user = Owner.query.filter_by(username=username).first()
        if user is None:
            return make_response({"error": "Username not found"}, 401)

        if user.authenticate(password):
            session["user_id"] = user.id
            return user.to_dict()
        
        return make_response({"error": "Incorrect password"}, 401)
    
api.add_resource(Login, '/login')

class Signup(Resource):
    def post(self):
        data = request.json
        required_fields = ['firstName', 'lastName', 'email', 'username', 'password']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return make_response({'error': 'Missing fields: ' + ', '.join(missing_fields)}, 400)
        
        user = Owner(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            username=data['username'],
            password_hash=data['password']
        )
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        
        return make_response(user.to_dict(), 200)

api.add_resource(Signup, '/signup')


class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message': 'Successfully logged out'}, 204)

api.add_resource(Logout, '/logout')


class CheckSession(Resource):
    def get(self):
        user = Owner.query.filter_by(id=session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401

api.add_resource(CheckSession, '/check_session')

class ClothesResource(Resource):
    def get(self, clothes_id=None):
        if clothes_id:
            clothes = Clothes.query.get(clothes_id)
            if clothes:
                return clothes.serialize(), 200
            else:
                return {'message': 'Clothes not found'}, 404
        else:
            clothes_list = Clothes.query.all()
            return [item.to_dict() for item in clothes_list], 200

    def post(self):
        data = request.json
        new_clothes = Clothes(
            name=data.get('name'),
            designer_name=data.get('designer_name'),
            description=data.get('description'),
            showcase=data.get('showcase'),
            price=data.get('price'),
            owner_id=data.get('owner_id'),
            image_url=data.get('image_url')
        )
        db.session.add(new_clothes)
        try:
            db.session.commit()
            return {'message': 'New clothes item added', 'id': new_clothes.id}, 201
        except Exception as e: 
            db.session.rollback()
            return {'message': 'Failed to add clothes item', 'error': str(e)}, 500

api.add_resource(ClothesResource, "/clothes")


class ClothesById(Resource):
    def get(self, id):
        clothes = Clothes.query.filter_by(id=id).first()
        if clothes:
            return make_response(clothes.to_dict(), 200)
        else:
            return make_response({'message': 'Clothes not found'}, 404)
    
    def delete(self, id):
        clothes = Clothes.query.filter_by(id=id).first()
        if clothes:
            db.session.delete(clothes)
            db.session.commit()
            return make_response({'message': 'Clothes deleted'}, 204)
        else:
            return make_response({'message': 'Clothes not found'}, 404)

api.add_resource(ClothesById, "/clothes/<id>")


class ReviewResource(Resource):
    def get(self):
        clothes_id = request.args.get('clothes_id')
        try:
            if clothes_id:
                reviews = Review.query.filter_by(clothes_id=clothes_id).all()
            else:
                reviews = Review.query.all()

            return [review.to_dict() for review in reviews], 200

        except Exception as e:
            print(f"Error fetching reviews: {e}")
            return make_response({'message': 'Error fetching reviews', 'error': str(e)}, 500)

    def post(self):
        data = request.json
        new_review = Review(
            information=data.get('information'),
            owner_id=data.get('owner_id'),
            clothes_id=data.get('clothes_id')
        )
        db.session.add(new_review)
        try:
            db.session.commit()
            return make_response({'message': 'New review added', 'id': new_review.id}, 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'message': 'Failed to add review', 'error': str(e)}, 500)

api.add_resource(ReviewResource, '/reviews')


class ReviewsById(Resource):
    def get(self, review_id):
        review = Review.query.get(review_id)
        if review:
            return review.serialize(), 200
        else:
            return make_response({'message': 'Review not found'}, 404)

    def delete(self, review_id):
        review = Review.query.get(review_id)
        if review:
            db.session.delete(review)
            try:
                db.session.commit()
                return make_response({'message': 'Review deleted'}, 204)
            except Exception as e:
                db.session.rollback()
                return make_response({'message': 'Failed to delete review', 'error': str(e)}, 500)
        else:
            return make_response({'message': 'Review not found'}, 404)
    
    def put(self, review_id):
        data = request.json
        review = Review.query.get(review_id)
        if not review:
            return make_response({'message': 'Review not found'}, 404)

        review.information = data.get('information', review.information)

        try:
            db.session.commit()
            return make_response({'message': 'Review updated', 'id': review.id}, 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'message': 'Failed to update review', 'error': str(e)}, 500)

api.add_resource(ReviewsById, '/reviews/<int:review_id>')





@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

