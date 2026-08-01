from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import get_current_user
from app.models import Property, User
from app.schemas import PropertyCreate, PropertyOut

router = APIRouter(prefix="/properties", tags=["properties"])


def _with_owner_contact(property_: Property) -> Property:
    """Attach the owner's name/phone onto the ORM object so PropertyOut
    (which reads via from_attributes) can pick them up without a separate
    lookup on the frontend."""
    property_.owner_name = property_.owner.full_name
    property_.owner_phone = property_.owner.phone_number
    return property_


@router.post("", response_model=PropertyOut, status_code=201)
def add_property(
    payload: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    property_ = Property(owner_id=current_user.id, **payload.model_dump())
    db.add(property_)
    db.commit()
    db.refresh(property_)
    return _with_owner_contact(property_)


@router.get("", response_model=List[PropertyOut])
def get_feed(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    properties = (
        db.query(Property)
        .options(joinedload(Property.owner))
        .order_by(Property.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_with_owner_contact(p) for p in properties]


@router.get("/{property_id}", response_model=PropertyOut)
def get_property(property_id: int, db: Session = Depends(get_db)):
    property_ = (
        db.query(Property)
        .options(joinedload(Property.owner))
        .filter(Property.id == property_id)
        .first()
    )
    if not property_:
        raise HTTPException(status_code=404, detail="Property not found")
    return _with_owner_contact(property_)
