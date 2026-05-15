from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, AddUserSchema
from app.utils.deps import get_current_user
from app.utils.auth import hash_password

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(current_user, key, val)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(User).filter(
    User.organization_id == current_user.organization_id
).order_by(User.created_at.desc()).all()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == user_id,
        User.organization_id == current_user.organization_id
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == user_id,
        User.organization_id == current_user.organization_id
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    db.delete(user)
    db.commit()






@router.post("/add", response_model=UserResponse, status_code=201)
def add_user(
    data: AddUserSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Only admin can create users
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can create users."
        )

    # Password match
    if data.password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail={"confirm_password": "Passwords do not match."}
        )

    # Email exists
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=400,
            detail={"email": "Email already exists."}
        )

    # Employee ID exists
    if db.query(User).filter(User.employee_id == data.employee_id).first():
        raise HTTPException(
            status_code=400,
            detail={"employee_id": "Employee ID already exists."}
        )

    # Generate username
    base_username = data.email.split("@")[0]
    username = base_username

    count = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{count}"
        count += 1

    # Create user
    user = User(
        organization_id = current_user.organization_id,

        employee_id = data.employee_id,

        first_name  = data.first_name,
        last_name   = data.last_name,

        username    = username,
        email       = data.email,
        phone       = data.phone,

        password    = hash_password(data.password),

        role        = data.role.lower(),

        department  = data.department,
        location    = data.location,
        joining_date= data.joining_date,
        notes       = data.notes,

        is_active   = True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


