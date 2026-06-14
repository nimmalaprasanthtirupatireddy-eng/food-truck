from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    description = Column(String)
    category = Column(String)

    price = Column(Float)

    image_url = Column(String)

    available = Column(Boolean, default=True)

    featured = Column(Boolean, default=False)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String)
    phone = Column(String)
    pickup_time = Column(String)
    notes = Column(String)

    total_amount = Column(Float)

    status = Column(String, default="Pending")

    order_code = Column(String, unique=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)

    order_id = Column(Integer, ForeignKey("orders.id"))

    menu_item_id = Column(Integer)

    item_name = Column(String)

    quantity = Column(Integer)

    price = Column(Float)

    order = relationship(
        "Order",
        back_populates="items"
    )


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True)

    email = Column(String, unique=True)

    password_hash = Column(String)