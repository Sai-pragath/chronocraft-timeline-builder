from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

# Event Schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date_str: str
    image_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    timeline_id: int

    class Config:
        orm_mode = True

# Timeline Schemas
class TimelineBase(BaseModel):
    title: str
    description: Optional[str] = None

class TimelineCreate(TimelineBase):
    pass

class Timeline(TimelineBase):
    id: int
    owner_id: int
    created_at: datetime
    events: List[Event] = []

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
