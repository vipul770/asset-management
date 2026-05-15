from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.maintenance import MaintenanceRequest
from app.schemas.maintenance import MaintenanceCreate, MaintenanceUpdate, MaintenanceResponse
from app.utils.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/maintenance", tags=["Maintenance"])


@router.get("", response_model=List[MaintenanceResponse])
def get_all_maintenance(
    status:   Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(MaintenanceRequest)
    if status:
        query = query.filter(MaintenanceRequest.status == status)
    if priority:
        query = query.filter(MaintenanceRequest.priority == priority)
    return query.order_by(MaintenanceRequest.created_at.desc()).all()


@router.post("", response_model=MaintenanceResponse, status_code=201)
def create_maintenance(
    data: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Auto generate maintenance_id
    count = db.query(MaintenanceRequest).count()
    maintenance_id = f"MNT-{count + 1:03d}"

    req = MaintenanceRequest(
        **data.model_dump(),
        maintenance_id = maintenance_id,
        reported_by_id = current_user.id
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


@router.get("/stats")
def get_maintenance_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total       = db.query(MaintenanceRequest).count()
    pending     = db.query(MaintenanceRequest).filter(MaintenanceRequest.status == 'pending').count()
    in_progress = db.query(MaintenanceRequest).filter(MaintenanceRequest.status == 'in_progress').count()
    completed   = db.query(MaintenanceRequest).filter(MaintenanceRequest.status == 'completed').count()
    return {
        "total":       total,
        "pending":     pending,
        "in_progress": in_progress,
        "completed":   completed
    }


@router.get("/{req_id}", response_model=MaintenanceResponse)
def get_maintenance(
    req_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Maintenance request not found.")
    return req


@router.put("/{req_id}", response_model=MaintenanceResponse)
def update_maintenance(
    req_id: int,
    data: MaintenanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Maintenance request not found.")

    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(req, key, val)

    db.commit()
    db.refresh(req)
    return req


@router.delete("/{req_id}", status_code=204)
def delete_maintenance(
    req_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Maintenance request not found.")
    db.delete(req)
    db.commit()