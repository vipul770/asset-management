from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import RegisterSchema, LoginSchema, UserResponse, TokenResponse
from app.utils.auth import hash_password, verify_password, create_access_token, create_refresh_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

import random
import string
from app.models.user import User

def generate_organization_id(db):
    last_user = db.query(User).order_by(User.id.desc()).first()

    if last_user:
        next_number = last_user.id + 1
    else:
        next_number = 1

    return f"ORG-{next_number:04d}"

@router.post("/register", status_code=201)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    # Check passwords match
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail={"confirm_password": "Passwords do not match."})

    # Check email exists
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail={"email": "Email already registered."})

    # Generate username from email
    base_username = data.email.split('@')[0]
    username = base_username
    count = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{count}"
        count += 1

    organization_id = generate_organization_id(db)

    user = User(
        organization_id=organization_id,
        first_name = data.first_name,
        last_name  = data.last_name,
        username   = username,
        email      = data.email,
        phone      = data.phone,
        password   = hash_password(data.password),
        role            = "admin"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    tokens = {
        "access":  create_access_token({"sub": str(user.id)}),
        "refresh": create_refresh_token({"sub": str(user.id)}),
    }
    return {
        "message": "Registration successful.",
        "user":    UserResponse.model_validate(user),
        "tokens":  tokens
    }



@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    from datetime import datetime, timezone

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail={"error": "No account found with this email."})
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail={"error": "Incorrect password."})
    if not user.is_active:
        raise HTTPException(status_code=403, detail={"error": "Account is inactive."})

    # Save last login time
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    tokens = {
        "access":  create_access_token({"sub": str(user.id)}),
        "refresh": create_refresh_token({"sub": str(user.id)}),
    }
    return {
        "message": "Login successful.",
        "user":    UserResponse.model_validate(user),
        "tokens":  tokens
    }





    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail={"error": "No account found with this email."})

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail={"error": "Incorrect password."})

    if not user.is_active:
        raise HTTPException(status_code=403, detail={"error": "Account is inactive."})

    tokens = {
        "access":  create_access_token({"sub": str(user.id)}),
        "refresh": create_refresh_token({"sub": str(user.id)}),
    }
    return {
        "message": "Login successful.",
        "user":    UserResponse.model_validate(user),
        "tokens":  tokens
    }