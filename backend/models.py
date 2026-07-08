from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(100))

    timelines = relationship("Timeline", back_populates="owner")

class Timeline(Base):
    __tablename__ = "timelines"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="timelines")
    events = relationship("Event", back_populates="timeline", cascade="all, delete-orphan")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    timeline_id = Column(Integer, ForeignKey("timelines.id"))
    title = Column(String(100), index=True)
    description = Column(Text, nullable=True)
    date_str = Column(String(50)) # e.g., "1969-07-20", "15th Century"
    image_url = Column(String(255), nullable=True)

    timeline = relationship("Timeline", back_populates="events")
