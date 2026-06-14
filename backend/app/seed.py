import hashlib
from sqlalchemy.orm import Session
from app.models import MenuItem, Admin


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


def seed_data(db: Session):
    if db.query(MenuItem).count() == 0:
        items = [
            {
                "name": "Masala Dosa",
                "description": "Crispy dosa with potato masala and chutneys.",
                "price": 80,
                "category": "Food",
                "image_url": "/images/masala_dosa.jpg",
                "available": True,
                "featured": True,
            },
            {
                "name": "Ghee Karam Dosa",
                "description": "Andhra-style dosa with ghee and karam podi.",
                "price": 100,
                "category": "Food",
                "image_url": "/images/ghee-karam-dosa.jpg",
                "available": True,
                "featured": True,
            },
            {
                "name": "Idli (2 pcs)",
                "description": "Soft steamed idlis served with chutney and sambar.",
                "price": 40,
                "category": "Food",
                "image_url": "/images/idli.jpg",
                "available": True,
                "featured": False,
            },
            {
                "name": "Poori Curry",
                "description": "Fluffy pooris served with potato curry.",
                "price": 60,
                "category": "Food",
                "image_url": "/images/poori_curry.jpg",
                "available": True,
                "featured": False,
            },
            {
                "name": "Paneer Roll",
                "description": "Loaded paneer wrap with spicy sauce.",
                "price": 120,
                "category": "Food",
                "image_url": "/images/paneer_wrap.jpg",
                "available": True,
                "featured": True,
            },
            {
                "name": "Veg Fried Rice",
                "description": "Street-style fried rice with vegetables.",
                "price": 130,
                "category": "Food",
                "image_url": "/images/veg-fried-rice.jpg",
                "available": True,
                "featured": False,
            },
            {
                "name": "Chicken Fried Rice",
                "description": "Chicken fried rice with Indo-Chinese flavors.",
                "price": 160,
                "category": "Food",
                "image_url": "/images/chicken-fried-rice.jpg",
                "available": True,
                "featured": True,
            },

            {
                "name": "Mango Juice",
                "description": "Fresh mango juice.",
                "price": 50,
                "category": "Juices",
                "image_url": "/images/mango-juice.jpg",
                "available": True,
                "featured": True,
            },
            {
                "name": "Watermelon Juice",
                "description": "Fresh watermelon juice.",
                "price": 40,
                "category": "Juices",
                "image_url": "/images/watermelon-juice.jpg",
                "available": True,
                "featured": False,
            },
            {
                "name": "Mosambi Juice",
                "description": "Sweet lime juice.",
                "price": 50,
                "category": "Juices",
                "image_url": "/images/mosambi-juice.jpg",
                "available": True,
                "featured": False,
            },
            {
                "name": "Badam Milk",
                "description": "Chilled badam milk.",
                "price": 60,
                "category": "Juices",
                "image_url": "/images/badam-milk.jpg",
                "available": True,
                "featured": True,
            },

            {
                "name": "Dosa + Mango Juice",
                "description": "Customer favorite combo.",
                "price": 120,
                "category": "Combos",
                "image_url": "/images/dosa-mango-combo.png",
                "available": True,
                "featured": True,
            },
            {
                "name": "Idli + Badam Milk",
                "description": "Breakfast combo.",
                "price": 90,
                "category": "Combos",
                "image_url": "/images/idli-badam-combo.png",
                "available": True,
                "featured": False,
            },

            {
                "name": "Gulab Jamun",
                "description": "Warm gulab jamun.",
                "price": 40,
                "category": "Desserts",
                "image_url": "/images/gulab_jamun.jpg",
                "available": True,
                "featured": True,
            },
            {
                "name": "Double Ka Meetha",
                "description": "Hyderabadi special dessert.",
                "price": 70,
                "category": "Desserts",
                "image_url": "/images/double-ka-meetha.jpg",
                "available": True,
                "featured": False,
            },
        ]

        for item in items:
            db.add(MenuItem(**item))

        print("✅ Menu items seeded successfully")

    if db.query(Admin).count() == 0:
        admin = Admin(
            email="admin@foodtruck.com",
            password_hash=hash_password("admin123"),
        )
        db.add(admin)
        print("✅ Admin user seeded successfully")

    db.commit()