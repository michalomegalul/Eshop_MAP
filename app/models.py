import uuid
from datetime import datetime, date
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import CheckConstraint
from typing import TYPE_CHECKING

db = SQLAlchemy()

if TYPE_CHECKING:
    from flask_sqlalchemy.model import Model
else:
    Model = db.Model


class User(Model):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), nullable=False, unique=True)
    first_name = db.Column(db.String(80), nullable=True)
    last_name = db.Column(db.String(80), nullable=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    telephone = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, comment='Possible values: admin, customer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = db.Column(db.String(20), nullable=True, comment='Possible values: active, inactive, suspended')

    addresses = db.relationship("UserAddress", backref="user", lazy=True)
    payment_methods = db.relationship("UserPaymentMethod", backref="user", lazy=True)
    orders = db.relationship("Order", backref="user", lazy=True)
    shopping_cart = db.relationship("ShoppingCart", backref="user", uselist=False, cascade="all, delete-orphan")


class UserAddress(Model):
    __tablename__ = "user_addresses"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    address_line1 = db.Column(db.String(120), nullable=False)
    address_line2 = db.Column(db.String(120), nullable=True)
    city = db.Column(db.String(80), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserPaymentMethod(Model):
    __tablename__ = "user_payment_methods"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    payment_type = db.Column(db.String(20), nullable=False)
    provider = db.Column(db.String(80), nullable=False)
    account_no = db.Column(db.String(120), nullable=False)
    expiry = db.Column(db.Date, nullable=False)


class Category(Model):
    __tablename__ = "categories"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(120), nullable=False)
    parent_id = db.Column(UUID(as_uuid=True), db.ForeignKey("categories.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    subcategories = db.relationship("Category", backref=db.backref("parent", remote_side=[id]), lazy=True)
    products = db.relationship("Product", backref="category", lazy=True)


class Product(Model):
    __tablename__ = "products"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False)
    category_id = db.Column(UUID(as_uuid=True), db.ForeignKey("categories.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = db.relationship("ProductImage", backref="product", lazy=True)
    reviews = db.relationship("ProductReview", backref="product", lazy=True)
    order_items = db.relationship("OrderItem", backref="product", lazy=True)
    cart_items = db.relationship("CartItem", backref="product", lazy=True)


class ProductImage(Model):
    __tablename__ = "product_images"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey("products.id"), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    alt_text = db.Column(db.String(255), nullable=True)
    is_primary = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProductReview(Model):
    __tablename__ = "product_reviews"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey("products.id"), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Order(Model):
    __tablename__ = "orders"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), nullable=False, comment="Possible values: pending, completed, cancelled, shipped")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order_items = db.relationship("OrderItem", backref="order", lazy=True)
    payment = db.relationship("OrderPayment", backref="order", uselist=False, cascade="all, delete-orphan")
    shipping = db.relationship("OrderShipping", backref="order", uselist=False, cascade="all, delete-orphan")


class OrderItem(Model):
    __tablename__ = "order_items"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class OrderPayment(Model):
    __tablename__ = "order_payments"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey("orders.id"), nullable=False)
    payment_method_id = db.Column(UUID(as_uuid=True), db.ForeignKey("user_payment_methods.id"), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), nullable=False, comment="Possible values: pending, completed, failed, refunded")
    transaction_id = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OrderShipping(Model):
    __tablename__ = "order_shipping"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey("orders.id"), nullable=False)
    address_line1 = db.Column(db.String(120), nullable=False)
    address_line2 = db.Column(db.String(120), nullable=True)
    city = db.Column(db.String(80), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(80), nullable=False)
    shipping_method = db.Column(db.String(80), nullable=False)
    tracking_number = db.Column(db.String(80), nullable=True)
    status = db.Column(db.String(20), nullable=False, comment="Possible values: shipped, in transit, delivered")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ShoppingCart(Model):
    __tablename__ = "shopping_carts"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    cart_items = db.relationship("CartItem", backref="cart", lazy=True, cascade="all, delete-orphan")


class CartItem(Model):
    __tablename__ = "cart_items"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_id = db.Column(UUID(as_uuid=True), db.ForeignKey("shopping_carts.id"), nullable=False)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey("products.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AuditLog(Model):
    __tablename__ = "audit_log"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    action = db.Column(db.String(120), nullable=False)
    table_name = db.Column(db.String(120), nullable=False)
    record_id = db.Column(UUID(as_uuid=True), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)




# class Coupon(Model):
#     __tablename__ = "coupons"

#     id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     code = db.Column(db.String(120), unique=True, nullable=False)
#     discount_percent = db.Column(db.Integer, nullable=False)
#     expiration_date = db.Column(db.Date, nullable=False)
#     is_active = db.Column(db.Boolean, nullable=False, default=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     __table_args__ = (
#         CheckConstraint('discount_percent > 0 AND discount_percent <= 100', name='check_discount_percent'),
#     )



# class OrderCoupon(Model):
#     __tablename__ = "order_coupons"

#     id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     order_id = db.Column(UUID(as_uuid=True), db.ForeignKey("orders.id"), nullable=False)
#     coupon_id = db.Column(UUID(as_uuid=True), db.ForeignKey("coupons.id"), nullable=False)
#     applied_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
