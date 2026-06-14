from pydantic import BaseModel
from typing import List, Optional


class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    price: float
    image_url: Optional[str] = None
    available: bool = True
    featured: bool = False


class MenuItemCreate(MenuItemBase):
    pass


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    available: Optional[bool] = None
    featured: Optional[bool] = None


class MenuItemResponse(MenuItemBase):
    id: int

    class Config:
        from_attributes = True


class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    pickup_time: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    item_name: str
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    order_code: str
    customer_name: str
    phone: str
    pickup_time: Optional[str]
    notes: Optional[str]
    total_amount: float
    status: str
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str

class OrderStatusUpdate(BaseModel):
    status: str