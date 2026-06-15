from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid

from app.database import get_db
from app.models import MenuItem
from app.schemas import MenuItemCreate, MenuItemUpdate, MenuItemResponse
from app.auth import verify_admin_token

router = APIRouter(prefix="/menu", tags=["Menu"])

UPLOAD_DIR = "uploads"


@router.get("/", response_model=List[MenuItemResponse])
def get_menu(db: Session = Depends(get_db)):
    return db.query(MenuItem).all()


@router.get("/featured", response_model=List[MenuItemResponse])
def get_featured_items(db: Session = Depends(get_db)):
    return db.query(MenuItem).filter(MenuItem.featured == True).all()


@router.get("/category/{category}", response_model=List[MenuItemResponse])
def get_menu_by_category(category: str, db: Session = Depends(get_db)):
    return db.query(MenuItem).filter(MenuItem.category == category).all()


@router.post("/", response_model=MenuItemResponse, dependencies=[Depends(verify_admin_token)])
def create_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    new_item = MenuItem(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.put("/{item_id}", response_model=MenuItemResponse, dependencies=[Depends(verify_admin_token)])
def update_menu_item(
    item_id: int,
    item: MenuItemUpdate,
    db: Session = Depends(get_db)
):
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    update_data = item.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(menu_item, key, value)

    db.commit()
    db.refresh(menu_item)
    return menu_item


@router.delete("/{item_id}", dependencies=[Depends(verify_admin_token)])
def delete_menu_item(item_id: int, db: Session = Depends(get_db)):
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    db.delete(menu_item)
    db.commit()

    return {"message": "Menu item deleted successfully"}


@router.patch("/{item_id}/availability", response_model=MenuItemResponse, dependencies=[Depends(verify_admin_token)])
def toggle_availability(item_id: int, db: Session = Depends(get_db)):
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    menu_item.available = not menu_item.available

    db.commit()
    db.refresh(menu_item)
    return menu_item


@router.patch("/{item_id}/featured", response_model=MenuItemResponse, dependencies=[Depends(verify_admin_token)])
def toggle_featured(item_id: int, db: Session = Depends(get_db)):
    menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    menu_item.featured = not menu_item.featured

    db.commit()
    db.refresh(menu_item)

    return menu_item


@router.post("/upload-image", dependencies=[Depends(verify_admin_token)])
def upload_image(file: UploadFile = File(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "image_url": f"/uploads/{filename}"
    }