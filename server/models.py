from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

# Models go here!
class Owner(db.Model, SerializerMixin):
    __tablename__ = 'owners'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.column(db.String)

    reviews = db.relationship('Review', back_populates = 'owner', cascade='all, delete-orphan')
    clothes = association_proxy('reviews', 'cloth')

    def __repr__(self):
        return f"<Owner(id={self.id}, name={self.name})>"
    

class Clothes(db.Model, SerializerMixin):
    __tablename__ = 'clothes'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    name = db.Column(db.String)
    designer_name = db.Column(db.String)
    description = db.Column(db.Text)
    showcase = db.Column(db.Text)
    price = db.Column(db.Integer)

    reviews = db.relationship('Review', back_populates='clothes', cascade='all, delete-orphan')
    review_writers = association_proxy('reviews', 'owner')

    def __repr__(self):
        return f"<Clothes(id={self.id}, name={self.name}, designer_name={self.designer_name})>"
    

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    information = db.Column(db.Text)

    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    clothes_id = db.Column(db.Integer, db.ForeignKey('clothes.id'))

    owner = db.relationship('Owner', back_populates='reviews')
    cloth = db.relationship('Clothes', back_populates='reviews')

    def __repr__(self):
        return f"<Review(id={self.id}, information={self.information})>"

    
    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))