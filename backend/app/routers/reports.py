from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.report import Report
from app.models.asset import Asset
from app.models.maintenance import MaintenanceRequest
from app.schemas.report import ReportCreate, ReportResponse
from app.utils.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/reports", tags=["Reports"])


@router.get("", response_model=List[ReportResponse])
def get_all_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Report).order_by(Report.created_at.desc()).all()


@router.post("", response_model=ReportResponse, status_code=201)
def create_report(
    data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count     = db.query(Report).count()
    report_id = f"RPT-{count + 1:03d}"

    report = Report(
        **data.model_dump(),
        report_id        = report_id,
        status           = 'ready',
        generated_by_id  = current_user.id
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.user import User as UserModel
    return {
        "total_assets":      db.query(Asset).count(),
        "assigned_assets":   db.query(Asset).filter(Asset.status == 'assigned').count(),
        "available_assets":  db.query(Asset).filter(Asset.status == 'available').count(),
        "maintenance_assets":db.query(Asset).filter(Asset.status == 'maintenance').count(),
        "total_users":       db.query(UserModel).count(),
        "active_users":      db.query(UserModel).filter(UserModel.is_active == True).count(),
        "pending_maintenance":db.query(MaintenanceRequest).filter(MaintenanceRequest.status == 'pending').count(),
        "total_reports":     db.query(Report).count(),
    }


@router.delete("/{report_id}", status_code=204)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    db.delete(report)
    db.commit()