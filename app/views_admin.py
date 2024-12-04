from flask import Blueprint, render_template, jsonify, request
from .models import db, User, Product, Category

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

# Base Admin Dashboard
@admin_bp.route("/")
def admin_dashboard():
    return render_template("app/templates/admin/admin_dashboard.html")

# Manage Products
@admin_bp.route("/products", methods=["GET", "POST"])
def manage_products():
    if request.method == "POST":
        data = request.get_json()
        new_product = Product(
            name=data["name"],
            description=data.get("description", ""),
            price=data["price"],
            stock_quantity=data["stock_quantity"],
            category_id=data["category_id"],
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Product added successfully"}), 201
    products = Product.query.all()
    return render_template("admin_products.html", products=products)

# Manage Categories
@admin_bp.route("/categories", methods=["GET", "POST"])
def manage_categories():
    if request.method == "POST":
        data = request.get_json()
        new_category = Category(
            name=data["name"], description=data.get("description", "")
        )
        db.session.add(new_category)
        db.session.commit()
        return jsonify({"message": "Category added successfully"}), 201
    categories = Category.query.all()
    return render_template("admin_categories.html", categories=categories)

# Manage Users
@admin_bp.route("/users", methods=["GET"])
def manage_users():
    users = User.query.all()
    return render_template("admin_users.html", users=users)

# Delete or Update Functionality
@admin_bp.route("/<entity>/<int:entity_id>", methods=["PUT", "DELETE"])
def modify_entity(entity, entity_id):
    model = {"product": Product, "category": Category, "user": User}.get(entity)
    if not model:
        return jsonify({"error": "Invalid entity"}), 400

    instance = model.query.get_or_404(entity_id)
    if request.method == "PUT":
        data = request.get_json()
        for key, value in data.items():
            setattr(instance, key, value)
        db.session.commit()
        return jsonify({"message": f"{entity.capitalize()} updated successfully"}), 200

    db.session.delete(instance)
    db.session.commit()
    return jsonify({"message": f"{entity.capitalize()} deleted successfully"}), 200
