from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models import Admin, MenuItem, Order, OrderItem
from app.schemas import LoginRequest
from app.auth import verify_password, create_token, verify_admin_token
from app.auth import verify_admin_token

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/login")
def admin_login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == payload.email).first()

    if not admin:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "access_token": create_token(),
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "email": admin.email,
        },
    }


@router.get("/stats")
def dashboard_stats(
    auth=Depends(verify_admin_token),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).all()

    total_orders = len(orders)
    pending = db.query(Order).filter(Order.status == "Pending").count()
    preparing = db.query(Order).filter(Order.status == "Preparing").count()
    ready = db.query(Order).filter(Order.status == "Ready").count()
    completed = db.query(Order).filter(Order.status == "Completed").count()
    cancelled = db.query(Order).filter(Order.status == "Cancelled").count()

    menu_items = db.query(MenuItem).count()
    revenue = sum(order.total_amount or 0 for order in orders)

    today = date.today()

    today_orders_list = [
        order for order in orders
        if order.created_at and order.created_at.date() == today
    ]

    today_orders = len(today_orders_list)
    today_revenue = sum(order.total_amount or 0 for order in today_orders_list)

    order_items = db.query(OrderItem).all()

    item_sales = {}

    for item in order_items:
        if item.item_name not in item_sales:
            item_sales[item.item_name] = 0

        item_sales[item.item_name] += item.quantity

    top_selling_item = "No sales yet"

    if item_sales:
        top_selling_item = max(item_sales, key=item_sales.get)

    return {
        "total_orders": total_orders,
        "pending": pending,
        "preparing": preparing,
        "ready": ready,
        "completed": completed,
        "cancelled": cancelled,
        "menu_items": menu_items,
        "revenue": revenue,
        "today_orders": today_orders,
        "today_revenue": today_revenue,
        "top_selling_item": top_selling_item,
    }

@router.get("/test-auth")
def test_auth(
    auth=Depends(verify_admin_token)
):
    return {
        "message": "Token valid"
    }