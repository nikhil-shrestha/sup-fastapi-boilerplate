from app.db.base_class import Base
from sqlalchemy import Column, ForeignKey, UniqueConstraint, Integer
from sqlalchemy.orm import relationship


class UserRole(Base):
    __tablename__ = "user_roles"
    user_id = Column(
       Integer,
        ForeignKey("users.id"),
        primary_key=True,
        nullable=False,
    )
    role_id = Column(
        Integer,
        ForeignKey("roles.id"),
        primary_key=True,
        nullable=False,
    )

    role = relationship("Role")
    user = relationship("User", back_populates="user_role", uselist=False)

    __table_args__ = (
        UniqueConstraint("user_id", "role_id", name="unique_user_role"),
    )
