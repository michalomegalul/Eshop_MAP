from flask import Blueprint, jsonify, request, current_app
from .models import db, User, Product, Order, ProductReview, Category #, Coupon
import logging

logger = logging.getLogger(__name__)

api_bp = Blueprint("api", __name__)

# ---------- TEST ----------
@api_bp.route("/ping", methods=["GET"])
def ping():
    return "pong"
# def site_map():
#     links = []
#     for rule in app.url_map.iter_rules():
#         if "GET" in rule.methods and has_no_empty_params(rule):
#             url = url_for(rule.endpoint, **(rule.defaults or {}))
#             links.append((url, rule.endpoint))
#     return {"links": links}
# ---------- Product Viewing Endpoints ----------

@api_bp.route("/products", methods=["GET"])
def get_all_products():
    """Fetch all products with optional filtering by category."""
    try:
        category_id = request.args.get("category_id")
        
        # If category_id is provided, filter products by category
        if category_id:
            products = Product.query.filter_by(category_id=category_id).all()
        else:
            products = Product.query.all()

        products_data = [
            {
                "id": str(product.id),
                "name": product.name,
                "description": product.description,
                "price": float(product.price),
                "stock_quantity": product.stock_quantity,
                "category_id": str(product.category_id),
                "created_at": product.created_at,
                "updated_at": product.updated_at
            }
            for product in products
        ]
        return jsonify(products_data), 200
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return jsonify({"error": "Failed to fetch products"}), 500


@api_bp.route("/products/<uuid:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    """Fetch a single product by its ID."""
    try:
        product = Product.query.get_or_404(product_id)
        product_data = {
            "id": str(product.id),
            "name": product.name,
            "description": product.description,
            "price": float(product.price),
            "stock_quantity": product.stock_quantity,
            "category_id": str(product.category_id),
            "created_at": product.created_at,
            "updated_at": product.updated_at
        }
        return jsonify(product_data), 200
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        return jsonify({"error": "Failed to fetch product"}), 500


@api_bp.route("/products/category/<uuid:category_id>", methods=["GET"])
def get_products_by_category(category_id):
    """Fetch all products belonging to a specific category."""
    try:
        products = Product.query.filter_by(category_id=category_id).all()
        products_data = [
            {
                "id": str(product.id),
                "name": product.name,
                "description": product.description,
                "price": float(product.price),
                "stock_quantity": product.stock_quantity,
                "category_id": str(product.category_id),
                "created_at": product.created_at,
                "updated_at": product.updated_at
            }
            for product in products
        ]
        return jsonify(products_data), 200
    except Exception as e:
        logger.error(f"Error fetching products for category {category_id}: {e}")
        return jsonify({"error": "Failed to fetch products"}), 500
    
# ---------- User Endpoints ----------

@api_bp.route("/users", methods=["POST"])
def add_user():
    try:
        data = request.get_json()
        new_user = User(
            username=data["username"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            email=data["email"],
            telephone=data.get("telephone", ""),
            password_hash=data["password_hash"],
            role=data["role"],
            status=data.get("status", "active")
        )
        db.session.add(new_user)
        db.session.commit()
        logger.info(f"New user created: {new_user.id}")
        return jsonify({"id": str(new_user.id)}), 201
    except Exception as e:
        logger.error(f"Error adding new user: {e}")
        return jsonify({"error": "Failed to add new user"}), 500

@api_bp.route("/users/<uuid:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        user.username = data.get("username", user.username)
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.telephone = data.get("telephone", user.telephone)
        user.status = data.get("status", user.status)
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {e}")
        return jsonify({"error": "Failed to update user"}), 500

@api_bp.route("/users/<uuid:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting user {user_id}: {e}")
        return jsonify({"error": "Failed to delete user"}), 500

# ---------- Product Endpoints ----------

@api_bp.route("/products", methods=["POST"])
def add_product():
    try:
        data = request.get_json()
        new_product = Product(
            name=data["name"],
            description=data.get("description", ""),
            price=data["price"],
            stock_quantity=data["stock_quantity"],
            category_id=data["category_id"]
        )
        db.session.add(new_product)
        db.session.commit()
        logger.info(f"New product created: {new_product.id}")
        return jsonify({"id": str(new_product.id)}), 201
    except Exception as e:
        logger.error(f"Error adding new product: {e}")
        return jsonify({"error": "Failed to add new product"}), 500

@api_bp.route("/products/<uuid:product_id>", methods=["PUT"])
def update_product(product_id):
    try:
        data = request.get_json()
        product = Product.query.get_or_404(product_id)
        product.name = data.get("name", product.name)
        product.description = data.get("description", product.description)
        product.price = data.get("price", product.price)
        product.stock_quantity = data.get("stock_quantity", product.stock_quantity)
        db.session.commit()
        return jsonify({"message": "Product updated successfully"}), 200
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        return jsonify({"error": "Failed to update product"}), 500
    
# ---------- Category Endpoints ----------
@api_bp.route("/categories", methods=["POST"])
def add_category():
    try:
        data = request.get_json()
        new_category = Category(
            name=data["name"],
            description=data.get("description", "")
        )
        db.session.add(new_category)
        db.session.commit()
        logger.info(f"New category created: {new_category.id}")
        return jsonify({"id": str(new_category.id)}), 201
    except Exception as e:
        logger.error(f"Error adding new category: {e}")
        return jsonify({"error": "Failed to add new category"}), 500

@api_bp.route("/products/<uuid:product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {e}")
        return jsonify({"error": "Failed to delete product"}), 500

@api_bp.route("/products/<uuid:product_id>/reviews", methods=["GET"])
def get_product_reviews(product_id):
    try:
        reviews = ProductReview.query.filter_by(product_id=product_id).all()
        reviews_data = [
            {
                "id": str(review.id),
                "user_id": str(review.user_id),
                "rating": review.rating,
                "review_text": review.review_text,
                "created_at": review.created_at
            }
            for review in reviews
        ]
        return jsonify(reviews_data), 200
    except Exception as e:
        logger.error(f"Error fetching reviews for product {product_id}: {e}")
        return jsonify({"error": "Failed to fetch reviews"}), 500

# ---------- Coupon Endpoints ----------
@api_bp.route("/create-payment-intent", methods=["POST"])
def create_payment_intent():
    """Create a Stripe Payment Intent for a new order"""
    try:
        data = request.json
        # Amount should be provided in cents (e.g., 5000 for $50.00)
        amount = int(data.get("amount"))

        # Create a PaymentIntent with the given amount and currency
        intent = stripe.PaymentIntent.create(
            amount=amount,  # Amount in cents
            currency="usd",  # Currency (e.g., "usd")
            payment_method_types=["card"]  # Specify allowed payment method types
        )

        # Return the client secret to be used by the frontend to confirm payment
        return jsonify({"clientSecret": intent['client_secret']}), 200

    except Exception as e:
        logger.error(f"Error creating payment intent: {e}")
        return jsonify({"error": "Failed to create payment intent"}), 500

# ---------- Coupon Endpoints ----------

# @api_bp.route("/coupons", methods=["POST"])
# def add_coupon():
#     try:
#         data = request.get_json()
#         new_coupon = Coupon(
#             code=data["code"],
#             discount_percent=data["discount_percent"],
#             expiration_date=data["expiration_date"],
#             is_active=data.get("is_active", True)
#         )
#         db.session.add(new_coupon)
#         db.session.commit()
#         logger.info(f"New coupon created: {new_coupon.id}")
#         return jsonify({"id": str(new_coupon.id)}), 201
#     except Exception as e:
#         logger.error(f"Error adding new coupon: {e}")
#         return jsonify({"error": "Failed to add new coupon"}), 500

# @api_bp.route("/coupons/<uuid:coupon_id>", methods=["PUT"])
# def update_coupon(coupon_id):
#     try:
#         data = request.get_json()
#         coupon = Coupon.query.get_or_404(coupon_id)
#         coupon.code = data.get("code", coupon.code)
#         coupon.discount_percent = data.get("discount_percent", coupon.discount_percent)
#         coupon.expiration_date = data.get("expiration_date", coupon.expiration_date)
#         coupon.is_active = data.get("is_active", coupon.is_active)
#         db.session.commit()
#         return jsonify({"message": "Coupon updated successfully"}), 200
#     except Exception as e:
#         logger.error(f"Error updating coupon {coupon_id}: {e}")
#         return jsonify({"error": "Failed to update coupon"}), 500

# @api_bp.route("/coupons/<uuid:coupon_id>", methods=["DELETE"])
# def delete_coupon(coupon_id):
#     try:
#         coupon = Coupon.query.get_or_404(coupon_id)
#         db.session.delete(coupon)
#         db.session.commit()
#         return jsonify({"message": "Coupon deleted successfully"}), 200
#     except Exception as e:
#         logger.error(f"Error deleting coupon {coupon_id}: {e}")
#         return jsonify({"error": "Failed to delete coupon"}), 500
