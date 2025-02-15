from flask import Blueprint, jsonify, request, render_template, make_response
from .models import db, User, Product, Order, Category, OrderLike, OrderItem, OrderPayment, OrderStatus, UserPaymentMethod#, Coupon
import os
import uuid
import json
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt, get_jwt_identity, get_csrf_token
)
import datetime
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

from flask import request, jsonify

@api_bp.route("/products", methods=["GET"])
def get_all_products():
    try:
        print("🔍 Received request to /products")
        print(f"🔍 Request Args: {request.args}")  # Log query parameters

        page = request.args.get("page", default=1, type=int)
        per_page = request.args.get("per_page", default=12, type=int)
        pagination = Product.query.paginate(page=page, per_page=per_page, error_out=False)
        # Fetch all products
        products = Product.query.all()  # Get all products from DB

        if not products:
            print("No products found in the database.")
            return jsonify({
                "products": [],
                "total": 0,
                "pages": 0,
                "current_page": page
            }), 200

        # Manually paginate products
        # start = (page - 1) * per_page
        # end = start + per_page
        # paginated_products = products[start:end]

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
            for product in pagination.items
        ]

        response = jsonify({
            "products": products_data,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": pagination.page
        })
        response.headers['Content-Type'] = 'application/json'
        return response, 200

    except Exception as e:
        print(f"Error fetching products: {e}")
        return jsonify({"error": "Failed to fetch products"}), 500


# @api_bp.route("/products", methods=["GET"])
# def get_all_products():
#     """Fetch all products with optional filtering by category."""
#     try:
#         category_id = request.args.get("category_id")
        
#         # If category_id is provided, filter products by category
#         if category_id:
#             products = Product.query.filter_by(category_id=category_id).all()
#         else:
#             products = Product.query.all()

#         products_data = [
#             {
#                 "id": str(product.id),
#                 "name": product.name,
#                 "description": product.description,
#                 "price": float(product.price),
#                 "stock_quantity": product.stock_quantity,
#                 "category_id": str(product.category_id),
#                 "created_at": product.created_at,
#                 "updated_at": product.updated_at
#             }
#             for product in products
#         ]
#         return jsonify(products_data), 200
#     except Exception as e:
#         logger.error(f"Error fetching products: {e}")
#         return jsonify({"error": "Failed to fetch products"}), 500

@api_bp.route("/products/search", methods=["GET"])
def search_products():
    query = request.args.get("query", "")
    products = Product.query.filter(Product.name.ilike(f"%{query}%") | Product.description.ilike(f"%{query}%")).all()
    return jsonify([{"id": p.id, "name": p.name} for p in products])

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
        # Log or print to check the UUID format
        logger.info(f"Received product ID: {product_id}")

        product = Product.query.get_or_404(product_id)

        product_data = {
            "id": str(product.id),
            "name": product.name,
            "description": product.description,
            "price": float(product.price),
            "availability": "In Stock" if product.stock_quantity > 0 else "Out of Stock",
            "rating": product.rating if hasattr(product, "rating") else 4.5,  # Default rating
            "category_id": str(product.category_id),
            "created_at": product.created_at,
            "updated_at": product.updated_at
        }
        
        return jsonify(product_data), 200
    

    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        print(f"Error fetching product {product_id}: {e}")
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
    """Authenticate user and return JWT in secure cookies."""
    data = request.get_json()  # Ensure JSON parsing
    print("Received login data:", data)  # Debugging log

    if not data or not data.get("username") or not data.get("password"):
        print("Missing username or password")
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    
    if not user:
        print("User not found")
        return jsonify({"error": "Invalid username or password"}), 401

    if user.check_password(data["password"]):
        additional_claims = {"role": user.role, "name": user.first_name}  
        access_token = create_access_token(identity=user.id, additional_claims=additional_claims, expires_delta=datetime.timedelta(minutes=15))
        refresh_token = create_refresh_token(identity=user.id, expires_delta=datetime.timedelta(days=7))

        response = make_response(jsonify({"message": "Login successful"}))
        response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite="Lax")
        response.set_cookie("refresh_token", refresh_token, httponly=True, secure=False, samesite="Lax")
        response.set_cookie(
        "csrf_access_token", 
        get_csrf_token(access_token), 
        secure=False, 
        samesite="Lax"
        )
        response.set_cookie(
        "csrf_refresh_token", 
        get_csrf_token(refresh_token),  
        secure=False, 
        samesite="Lax"

        )

        print("Login successful, tokens set")
        return response, 200


    print("Invalid password")
    return jsonify({"error": "Invalid username or password"}), 401



@api_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # Requires a valid refresh token
def refresh():
    """Generate a new access token using the refresh token."""
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=user_id)

    response = make_response(jsonify({"message": "Token refreshed"}))
    response.set_cookie("access_token", new_access_token, httponly=True, secure=True, samesite="Strict")

    return response, 200
@api_bp.route("/auth-check", methods=["GET"])
@jwt_required() 
def auth_check():
    """Check if user is authenticated and return user info."""
    user_id = get_jwt_identity() 
    claims = get_jwt()

    return jsonify({
        "id": user_id,
        "role": claims.get("role"),
        "name": claims.get("name")
    }), 200
@api_bp.route("/logout", methods=["POST"])
def logout():
    """Clear authentication cookies to log out the user."""
    response = make_response(jsonify({"message": "Logged out"}))
    response.set_cookie("access_token", "", expires=0, httponly=True, secure=True, samesite="Strict")
    response.set_cookie("refresh_token", "", expires=0, httponly=True, secure=True, samesite="Strict")

    return response, 200


# @api_bp.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     """A protected route that requires a valid JWT."""
#     claims = get_jwt()
#     user_role = claims.get("role", "user")
#     user_name = claims.get("name", "unknown")

#     return jsonify({"user_name": user_name, "user_role": user_role}), 200



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

# @api_bp.route("/products/<uuid:product_id>/reviews", methods=["GET"])
# def get_product_reviews(product_id):
#     try:
#         reviews = ProductReview.query.filter_by(product_id=product_id).all()
#         reviews_data = [
#             {
#                 "id": str(review.id),
#                 "user_id": str(review.user_id),
#                 "rating": review.rating,
#                 "review_text": review.review_text,
#                 "created_at": review.created_at
#             }
#             for review in reviews
#         ]
#         return jsonify(reviews_data), 200
#     except Exception as e:
#         logger.error(f"Error fetching reviews for product {product_id}: {e}")
#         return jsonify({"error": "Failed to fetch reviews"}), 500

# ---------- Payment Intent Endpoint ----------
@api_bp.route("/create-checkout-session", methods=["POST"])
@jwt_required()
def create_checkout_session():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or "cart" not in data:
            return jsonify({"error": "Invalid cart data"}), 400

        cart_items = data["cart"]
        line_items = []
        product_metadata = []

        for item in cart_items:
            line_items.append({
                "price_data": {
                    "currency": "czk",
                    "product_data": {
                        "name": item["name"]
                    },
                    "unit_amount": int(item["price"] * 100),  # Convert dollars to cents
                },
                "quantity": item["quantity"],
            })
            product_metadata.append({
                "id": item["id"],
                "name": item["name"],
                "price": item["price"],
                "quantity": item["quantity"]
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url="http://localhost:8000/#/success",
            cancel_url="http://localhost:8000/#/cancel",
            metadata={
                "user_id": user_id,
                "products": json.dumps(product_metadata)  # Convert list to JSON string
            }
        )

        return jsonify({"url": session.url}), 200

    except Exception as e:
        print("Error creating checkout session:", e)
        return jsonify({"error": str(e)}), 500

# ---------- Stripe Webhook Endpoint ----------
# @api_bp.route("/stripe/webhook", methods=["POST"])
# def stripe_webhook():
#     payload = request.get_data(as_text=True)
#     sig_header = request.headers.get("Stripe-Signature")
#     WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

#     try:
#         event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
#     except stripe.error.SignatureVerificationError as e:
#         print(f"Webhook signature verification failed: {e}")
#         return jsonify({"error": "Invalid signature"}), 400
#     except Exception as e:
#         print(f"Error parsing webhook: {e}")
#         return jsonify({"error": str(e)}), 400

#     # Print the full event for debugging
#     print("🔹 Received Stripe Webhook Event:")
#     print(json.dumps(event, indent=4))  # Pretty-print the JSON

#     return jsonify({"status": "received", "event_type": event["type"]}), 200

@api_bp.route("/stripe/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get("Stripe-Signature")
    WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError as e:
        print(f"Webhook signature verification failed: {e}")
        return jsonify({"error": "Invalid signature"}), 400
    except Exception as e:
        print(f"Error parsing webhook: {e}")
        return jsonify({"error": str(e)}), 400

    # print("🔹 Received Stripe Webhook Event:", json.dumps(event, indent=4))

    # Handle `checkout.session.completed`
    if event["type"] == "checkout.session.succeeded":
        session_data = event["data"]["object"]
        print("Checkout session data:", session_data)
        # Extract user ID and products from metadata
        user_id = session_data.get("metadata", {}).get("user_id")
        products_json = session_data.get("metadata", {}).get("products")
        payment_method_id = session_data.get("payment_method")  # Get payment method from Stripe
        transaction_id = session_data.get("payment_intent")  # Stripe payment intent ID
        amount_total = session_data.get("amount_total", 0) / 100  # Convert cents to currency

        if not user_id or not products_json:
            print("❌ Missing user_id or products in metadata")
            return jsonify({"error": "Invalid metadata"}), 400

        try:
            user_uuid = uuid.UUID(user_id)
            products = json.loads(products_json)
        except Exception as e:
            print(f"❌ Error parsing metadata: {e}")
            return jsonify({"error": "Invalid metadata format"}), 400

        # ✅ Create the order
        order = Order(
            user_id=user_uuid,
            total=amount_total,
            status=OrderStatus.COMPLETED
        )
        db.session.add(order)
        db.session.flush()  # Get order.id before adding items

        # ✅ Create order items
        for item in products:
            order_item = OrderItem(
                order_id=order.id,
                product_id=uuid.UUID(item["id"]),
                quantity=item["quantity"],
                price=item["price"]
            )
            db.session.add(order_item)

        # ✅ Store payment method if it doesn’t exist
        existing_payment_method = UserPaymentMethod.query.filter_by(id=payment_method_id).first()
        if not existing_payment_method:
            new_payment_method = UserPaymentMethod(
                id=payment_method_id,
                user_id=user_uuid
            )
            db.session.add(new_payment_method)

        # ✅ Create payment record
        payment = OrderPayment(
            order_id=order.id,
            payment_method_id=payment_method_id,
            amount=amount_total,
            status="completed",
            transaction_id=transaction_id
        )
        db.session.add(payment)

        # ✅ Commit changes to the database
        try:
            db.session.commit()
            print(f"✅ Order {order.id} successfully stored in DB.")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error saving order: {e}")
            return jsonify({"error": "Database error"}), 500

    return jsonify({"status": "success"}), 200



# ---------- Create Order Endpoint ----------
@api_bp.route("/orders", methods=["POST"])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data or "products" not in data or "total_price" not in data:
            logger.error("Invalid request data for order creation: %s", data)
            return jsonify({"error": "Invalid request data"}), 400

        new_order = Order(user_id=user_id, total=data["total_price"], status=OrderStatus.COMPLETED)
        db.session.add(new_order)
        db.session.commit()

        logger.info("Order created successfully for user_id %s", user_id)
        return jsonify({"message": "Order placed successfully", "order_id": new_order.id}), 201

    except Exception as e:
        logger.exception("Error creating order:")
        return jsonify({"error": str(e)}), 500

@api_bp.route("/orders", methods=["GET"])
@jwt_required()
def get_user_orders():
    try:
        user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=user_id).all()
        orders_data = [
            {
                "id": str(order.id),
                "total": order.total,
                "status": order.status,
                "created_at": order.created_at
            }
            for order in orders
        ]
        return jsonify(orders_data), 200
    except Exception as e:
        logger.exception("Error fetching user orders:")
        return jsonify({"error": "Failed to fetch orders"}), 500

@api_bp.route("/orders/<uuid:order_id>/like", methods=["POST"])
@jwt_required()
def like_order(order_id):
    try:
        user_id = get_jwt_identity()

        # OPTIONAL: Check if the user has already liked this order.
        # This enforces “one like per order per user.”
        existing_like = OrderLike.query.filter_by(order_id=order_id, user_id=user_id).first()
        if existing_like:
            return jsonify({"message": "Order already liked"}), 200

        # Create a new OrderLike record.
        new_like = OrderLike(order_id=order_id, user_id=user_id)
        db.session.add(new_like)
        db.session.commit()

        # Count the total likes for this order.
        like_count = OrderLike.query.filter_by(order_id=order_id).count()

        return jsonify({"message": "Order liked", "likes": like_count}), 200

    except Exception as e:
        logger.exception("Error liking order:")
        return jsonify({"error": "Failed to like order"}), 500


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
#helpers
