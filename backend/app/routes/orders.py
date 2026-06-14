from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from app.database import get_db
from app.models import Order, OrderItem, MenuItem
from app.schemas import OrderCreate, OrderStatusUpdate

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    total_amount = 0

    new_order = Order(
        customer_name=order.customer_name,
        phone=order.phone,
        pickup_time=order.pickup_time,
        notes=order.notes,
        status="Pending",
        order_code=str(uuid.uuid4())[:8].upper(),
        created_at=datetime.utcnow()
    )

    db.add(new_order)
    db.flush()

    for item in order.items:

        menu_item = (
            db.query(MenuItem)
            .filter(MenuItem.id == item.menu_item_id)
            .first()
        )

        if not menu_item:
            raise HTTPException(
                status_code=404,
                detail=f"Menu item {item.menu_item_id} not found"
            )

        item_total = menu_item.price * item.quantity
        total_amount += item_total

        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=menu_item.id,
            item_name=menu_item.name,
            quantity=item.quantity,
            price=menu_item.price
        )

        db.add(order_item)

    new_order.total_amount = total_amount

    db.commit()
    db.refresh(new_order)

    return {
        "message": "Order placed successfully",
        "order_id": new_order.id,
        "order_code": new_order.order_code,
        "total_amount": total_amount,
        "status": new_order.status
    }


@router.get("/")
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()


@router.get("/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@router.patch("/{order_id}/status")
def update_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = payload.status

    db.commit()

    return {
        "message": "Status updated",
        "status": order.status
    }

@router.get("/track/{order_code}")
def track_order(order_code: str, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .filter(Order.order_code == order_code.upper())
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "order_code": order.order_code,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "pickup_time": order.pickup_time,
        "notes": order.notes,
        "total_amount": order.total_amount,
        "status": order.status,
        "items": [
            {
                "name": item.item_name,
                "quantity": item.quantity,
                "price": item.price,
            }
            for item in order.items
        ],
    }