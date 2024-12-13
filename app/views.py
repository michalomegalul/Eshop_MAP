from flask import Blueprint, jsonify, request, render_template
from .models import db, User, Product, Order, ProductReview, Category #, Coupon
import os
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt
)
import stripe
import logging
logger = logging.getLogger(__name__)
jwt = JWTManager()
api_bp = Blueprint("api", __name__)

# ---------- TEST ----------
# @api_bp.route('/test-log', methods=['GET'])
# def test_log():
#     current_app.logger.info('Home page accessed')
#     return {"message": "Check your logs"}


@api_bp.route("/ping", methods=["GET"])
def ping():
    return "pong"
# def site_map():
#     links = []
#     for rule in api_bp.url_map.iter_rules():
#         if "GET" in rule.methods and has_no_empty_params(rule):
#             url = url_for(rule.endpoint, **(rule.defaults or {}))
#             links.append((url, rule.endpoint))
#     return {"links": links}
# @api_bp.route('/uwu', methods=["GET"])
# def index():
#     return render_template('register.html')
# ---------- Product and category Viewing Endpoints ----------

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

@api_bp.route("/categories", methods=["GET"])
def get_all_categories():
    """Fetch all categories."""
    try:
        categories = Category.query.all()
        categories_data = [
            {
                "id": str(category.id),
                "name": category.name,
                "parent_id": str(category.parent_id)
            }
            for category in categories
        ]
        return jsonify(categories_data), 200
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        return jsonify({"error": "Failed to fetch categories"}), 500
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
# ---------- User Viewing Endpoints ----------
@api_bp.route("/users", methods=["GET"])
def get_all_users():
    try:
        users = User.query.all()
        users_data = [
            {
                "id": str(user.id),
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "telephone": user.telephone,
                "role": user.role,
                "status": user.status,
                "created_at": user.created_at,
                "updated_at": user.updated_at
            }
            for user in users
        ]
        return jsonify(users_data), 200
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500

@api_bp.route("/users/<uuid:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    try:
        user = User.query.get_or_404(user_id)
        user_data = {
            "id": str(user.id),
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "telephone": user.telephone,
            "role": user.role,
            "status": user.status,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        return jsonify(user_data), 200
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        return jsonify({"error": "Failed to fetch user"}), 500
# ---------- User Endpoints ----------
@api_bp.route("/register", methods=["POST"])
def register():
    try:
        # Get data from JSON request
        data = request.get_json()

        # Validate input data
        if not data:
            return jsonify({"error": "Invalid or missing JSON payload"}), 400

        # Create new user instance
        new_user = User(
            username=data.get("username", ""),
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            email=data.get("email", ""),
            telephone=data.get("telephone", ""),
            role=data.get("role", "user"),
            status=data.get("status", "active")
        )

        # Set the password (hashing it)
        new_user.set_password(data.get("password", ""))

        # Add user to the session and commit to the database
        db.session.add(new_user)
        db.session.commit()

        # Log the creation of a new user
        logger.info(f"New user created: {new_user.id}")

        # Return the new user ID as a response
        return jsonify({"id": str(new_user.id)}), 201

    except Exception as e:
        # Log and handle any errors
        logger.error(f'Error adding new user: {e}', exc_info=True)
        return jsonify({"error": f"Failed to add new user: {str(e)}"}), 500


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

@api_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and return JWT."""
    data = request.json
    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if user and user.check_password(data["password"]):
        additional_claims = {"role": user.role, "name":user.first_name}  # Add role as a custom claim
        access_token = create_access_token(identity=user.id, additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

    return jsonify({"error": "Invalid username or password"}), 401


@api_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Revoke user's tokens."""
    # Implement token blacklisting here if needed
    return jsonify({"message": "Successfully logged out"}), 200

@api_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    """A protected route that requires a valid JWT."""
    claims = get_jwt()
    user_role = claims.get("role", "user")
    user_name = claims.get("name", "unknown")

    return jsonify({"user_name": user_name, "user_role": user_role}), 200



@api_bp.route("/admin", methods=["GET"])
@jwt_required()
def admin_page():
    """Serve the admin page if the user is an admin."""
    claims = get_jwt()  # Get JWT claims
    user_role = claims.get("role", "user")
    if user_role != "admin":
        return jsonify({"error": "Access denied"}), 403

    # Render the admin page for admins
    return render_template("admin.html")

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

        # Validate required fields
        if not data or not data.get("name"):
            return jsonify({"error": "Category name is required"}), 400

        # Check if parent category exists
        parent_category = None
        if "parent_id" in data and data["parent_id"]:
            parent_category = Category.query.get(data["parent_id"])
            if not parent_category:
                return jsonify({"error": "Parent category not found"}), 400

        # Create new category
        new_category = Category(
            name=data["name"],
            parent_id=data.get("parent_id")
        )

        db.session.add(new_category)
        db.session.commit()

        logger.info(f"New category created: {new_category.id}")
        return jsonify({"id": str(new_category.id)}), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding new category: {e}", exc_info=True)
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

# ---------- Stripe Endpoints ----------
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
# ---------- Webhooks endpint ----------
@api_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except ValueError as e:
        # Invalid payload
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return jsonify({'error': 'Invalid signature'}), 400

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']  # Contains the successful payment details
        print(f"Payment for {payment_intent['amount']} succeeded.")

    return jsonify({'status': 'success'}), 200

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
