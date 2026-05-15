from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil, os, uuid
from app.database import get_db
from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse
from app.utils.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/assets", tags=["Assets"])

UPLOAD_DIR = "media/assets"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=List[AssetResponse])
def get_all_assets(
    status:   Optional[str] = None,
    category: Optional[int] = None,
    search:   Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Asset)
    if status:
        query = query.filter(Asset.status == status)
    if category:
        query = query.filter(Asset.category_id == category)
    if search:
        query = query.filter(Asset.name.ilike(f"%{search}%"))
    return query.order_by(Asset.created_at.desc()).all()


@router.post("", response_model=AssetResponse, status_code=201)
def create_asset(
    data: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if db.query(Asset).filter(Asset.asset_id == data.asset_id).first():
        raise HTTPException(status_code=400, detail={"asset_id": "Asset ID already exists."})

    asset = Asset(**data.model_dump())
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.get("/stats")
def get_asset_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total       = db.query(Asset).count()
    assigned    = db.query(Asset).filter(Asset.status == 'assigned').count()
    available   = db.query(Asset).filter(Asset.status == 'available').count()
    maintenance = db.query(Asset).filter(Asset.status == 'maintenance').count()
    return {
        "total":       total,
        "assigned":    assigned,
        "available":   available,
        "maintenance": maintenance
    }


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")
    return asset


@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: int,
    data: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")

    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(asset, key, val)

    db.commit()
    db.refresh(asset)
    return asset


@router.delete("/{asset_id}", status_code=204)
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")
    db.delete(asset)
    db.commit()


@router.post("/{asset_id}/upload-image")
def upload_asset_image(
    asset_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")

    ext      = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    asset.image = filepath
    db.commit()
    return {"message": "Image uploaded.", "image": filepath}