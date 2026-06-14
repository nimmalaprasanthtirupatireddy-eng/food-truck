import hashlib
import uuid
from fastapi import Header, HTTPException

ACTIVE_ADMIN_TOKENS = set()


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed_password: str):
    return hash_password(password) == hashed_password


def create_token():
    token = str(uuid.uuid4())
    ACTIVE_ADMIN_TOKENS.add(token)
    return token


def verify_admin_token(x_admin_token: str = Header(None)):
    if not x_admin_token:
        raise HTTPException(status_code=401, detail="Missing admin token")

    if x_admin_token not in ACTIVE_ADMIN_TOKENS:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return True