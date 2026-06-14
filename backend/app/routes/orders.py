from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from app.database import get_db
from app.models import Order, OrderItem, MenuItem
from typing import List
from app.schemas import OrderCreate, OrderStatusUpdate, OrderResponse
from app.auth import verify_admin_token

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    total_amount = 0

    new_order = Order(
        customer_name=order.customer_name,
        phone=order.phone,
        pickup_time=order.pickup_time,
        notes=order.notes,
        status="Pending",
        order_code=str(uuid.uuid4())[:8].upper(),
        created_at=datetime.utcnow(),
    )

    db.add(new_order)
    db.flush()

    for item in order.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item.menu_item_id).first()

        if not menu_item:
            raise HTTPException(
                status_code=404,
                detail=f"Menu item {item.menu_item_id} not found",
            )

        item_total = menu_item.price * item.quantity
        total_amount += item_total

        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=menu_item.id,
            item_name=menu_item.name,
            quantity=item.quantity,
            price=menu_item.price,
        )

        db.add(order_item)

    new_order.total_amount = total_amount

    db.commit()
    db.refresh(new_order)

    # Save a mock receipt to file and simulate email sending
    import os
    try:
        # Resolve to backend/receipts
        routes_dir = os.path.dirname(os.path.abspath(__file__))
        app_dir = os.path.dirname(routes_dir)
        backend_dir = os.path.dirname(app_dir)
        receipts_dir = os.path.join(backend_dir, "receipts")
        os.makedirs(receipts_dir, exist_ok=True)
        
        receipt_path = os.path.join(receipts_dir, f"receipt_{new_order.order_code}.txt")
        with open(receipt_path, "w", encoding="utf-8") as f:
            f.write(f"=== EL FUEGO TRUCK ORDER RECEIPT ===\n")
            f.write(f"Order Code:  {new_order.order_code}\n")
            f.write(f"Date:        {new_order.created_at.strftime('%Y-%m-%d %H:%M:%S')} UTC\n")
            f.write(f"Customer:    {new_order.customer_name}\n")
            f.write(f"Phone:       {new_order.phone}\n")
            f.write(f"Pickup Time: {new_order.pickup_time or 'As soon as possible'}\n")
            f.write(f"Notes:       {new_order.notes or 'None'}\n")
            f.write(f"Status:      {new_order.status}\n")
            f.write(f"------------------------------------\n")
            for item in new_order.items:
                f.write(f"{item.item_name} x {item.quantity} @ ₹{item.price} = ₹{item.price * item.quantity}\n")
            f.write(f"------------------------------------\n")
            f.write(f"TOTAL AMOUNT: ₹{new_order.total_amount}\n")
            f.write(f"====================================\n")
        
        print(f"\n📧 [MOCK EMAIL] Sent confirmation receipt file to client's device ({new_order.phone}).")
        print(f"📁 Receipt saved at: {receipt_path}\n")
    except Exception as e:
        print(f"⚠️ Failed to write receipt: {e}")

    return {
        "message": "Order placed successfully",
        "order_id": new_order.id,
        "order_code": new_order.order_code,
        "total_amount": total_amount,
        "status": new_order.status,
    }


@router.get("/track/{order_code}")
def track_order(order_code: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_code == order_code.upper()).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "order_code": order.order_code,
        "customer_name": order.customer_name,
        "pickup_time": order.pickup_time,
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


@router.get("/", response_model=List[OrderResponse], dependencies=[Depends(verify_admin_token)])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.get("/crowd-level")
def get_crowd_level(db: Session = Depends(get_db)):
    active_count = (
        db.query(Order)
        .filter(Order.status.in_(["Pending", "Preparing", "Ready"]))
        .count()
    )

    if active_count < 3:
        level = "Chill"
        wait_time = "5-10"
        color = "green"
    elif active_count < 7:
        level = "Moderate"
        wait_time = "15-20"
        color = "yellow"
    else:
        level = "Sizzling Hot"
        wait_time = "30+"
        color = "red"

    return {
        "active_orders": active_count,
        "level": level,
        "wait_time_mins": wait_time,
        "color": color
    }


@router.get("/{order_id}", response_model=OrderResponse, dependencies=[Depends(verify_admin_token)])
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order


@router.patch("/{order_id}/status", dependencies=[Depends(verify_admin_token)])
def update_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = payload.status
    db.commit()

    return {
        "message": "Status updated",
        "status": order.status,
    }