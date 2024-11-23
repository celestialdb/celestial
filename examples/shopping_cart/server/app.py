from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *
from datetime import datetime
from time import sleep
from sqlalchemy import select, update, delete

app = Flask(__name__)
CORS(app)
CARTID = 1

# Configure the PostgreSQL database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://kriti@127.0.0.1:5432/shopping_cart'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Integer, nullable=False)

class Cart(db.Model):
    id = db.Column("cart_id", db.Integer, primary_key=True, nullable=False)
    cart_total = db.Column(db.Integer, nullable=False, default=0)
    
class CartLineitem(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    cart_id = db.Column(db.Integer, nullable=False)
    item_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)


@app.route('/')
def home():
    return "Hello, World!"

@app.route('/inventory', methods=['GET'])
@cross_origin()
def get_inventory():
    try:
        inventory = Inventory.query.all()
        response = [{'id': item.id, 'name': item.name, 'price': item.price} for item in inventory]
        return jsonify(response)
    except Exception as e:
        return(jsonify({'error': str(e)}), 500)
    

def get_cart_obj():
    cart = Cart.query.filter(Cart.id == CARTID).all()
    return [{'id': item.id, 'cart_total': item.cart_total} for item in cart]


@app.route('/cart', methods=['GET'])
@cross_origin()
def get_cart():
    try:
        # there will only ever be one entry in the cart table
        response = get_cart_obj()
        return jsonify(response)
    except Exception as e:
        return(jsonify({'error': str(e)}), 500)   


@app.route('/cart/items', methods=['GET'])
@cross_origin()
def get_cart_items():
    cart_lineitems = CartLineitem.query.filter(CartLineitem.cart_id == CARTID).all()
    return {"cart": [{'id': item.item_id, 'quantity': item.quantity} for item in cart_lineitems]}

def add_item_to_cart(item_id):
    cart_item = db.session.execute(select(CartLineitem).where(CartLineitem.cart_id == CARTID)
        .where(CartLineitem.item_id == item_id)).scalar_one_or_none()

    if cart_item:
        db.session.execute(
            update(CartLineitem)
            .where(CartLineitem.cart_id == CARTID, CartLineitem.item_id == item_id)
            .values(quantity=CartLineitem.quantity + 1)
        )
    else:
        # If item does not exist, insert a new row
        new_cart_item = CartLineitem(cart_id=CARTID, item_id=item_id, quantity=1)
        db.session.add(new_cart_item)

    item_price = db.session.execute(select(Inventory.price).where(Inventory.id == item_id)).scalar_one()
    db.session.query(Cart).filter(Cart.id == CARTID).update({'cart_total': Cart.cart_total + item_price})
    
    db.session.commit()
    return jsonify({'message': 'Item added to cart successfully'})

def remove_item_to_cart(item_id):
    cart_item = db.session.execute(select(CartLineitem).where(CartLineitem.cart_id == CARTID)
        .where(CartLineitem.item_id == item_id)).scalar_one_or_none()
    
    if cart_item.quantity == 1:
        db.session.execute(
            delete(CartLineitem)
            .where(CartLineitem.cart_id == CARTID, CartLineitem.item_id == item_id)
        )
    else:
        db.session.execute(
            update(CartLineitem)
            .where(CartLineitem.cart_id == CARTID, CartLineitem.item_id == item_id)
            .values(quantity=CartLineitem.quantity - 1)
        )

    item_price = db.session.execute(select(Inventory.price).where(Inventory.id == item_id)).scalar_one()
    db.session.query(Cart).filter(Cart.id == CARTID).update({'cart_total': Cart.cart_total - item_price})
    db.session.commit()
    return jsonify({'message': 'Item removed from cart successfully'})

def modify_cart(item_id, quantity, action):
    if quantity <= 0:
        db.session.execute(
            delete(CartLineitem)
            .where(CartLineitem.cart_id == CARTID, CartLineitem.item_id == item_id)
        )
    elif quantity == 1:
        new_cart_item = CartLineitem(cart_id=CARTID, item_id=item_id, quantity=1)
        db.session.add(new_cart_item)
    else:
        db.session.execute(
            update(CartLineitem)
            .where(CartLineitem.cart_id == CARTID, CartLineitem.item_id == item_id)
            .values(quantity=quantity)
        )

    item_price = db.session.execute(select(Inventory.price).where(Inventory.id == item_id)).scalar_one()
    if (action == 'add'):
        db.session.query(Cart).filter(Cart.id == CARTID).update({'cart_total': Cart.cart_total + item_price})
    else:
        db.session.query(Cart).filter(Cart.id == CARTID).update({'cart_total': Cart.cart_total - item_price})
        
    db.session.commit()
    return jsonify({'message': 'Item quantity updated'})

@app.route('/cart/<action>/<item_id>', methods=['PUT'])
@cross_origin()
def put_cart(action, item_id):
    if action == 'add' or action == 'remove':
        return modify_cart(item_id, request.get_json()['quantity'], action)
    else:
        return(jsonify({'Invalid Action'}), 400)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
