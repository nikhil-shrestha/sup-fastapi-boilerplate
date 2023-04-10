import datetime

from app.db.base_class import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, TEXT



class AccountFacilities(Base):
    """
    Database Model for an Account Facitlity
    """

    id = Column(Integer, primary_key=True, index=True)
    no_of_devices = Column(Integer, default=0)
    floor_plan_image_url = Column(TEXT)
    access_point_coordinates = Column(JSONB, default=[])
    no_of_access_points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)

