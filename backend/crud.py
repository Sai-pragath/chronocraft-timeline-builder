from sqlalchemy.orm import Session
import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_timelines(db: Session, user_id: int):
    return db.query(models.Timeline).filter(models.Timeline.owner_id == user_id).all()

def get_timeline(db: Session, timeline_id: int, user_id: int):
    return db.query(models.Timeline).filter(models.Timeline.id == timeline_id, models.Timeline.owner_id == user_id).first()

def create_timeline(db: Session, timeline: schemas.TimelineCreate, user_id: int):
    db_timeline = models.Timeline(**timeline.dict(), owner_id=user_id)
    db.add(db_timeline)
    db.commit()
    db.refresh(db_timeline)
    return db_timeline

def create_event(db: Session, event: schemas.EventCreate, timeline_id: int):
    db_event = models.Event(**event.dict(), timeline_id=timeline_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_timeline(db: Session, timeline_id: int, user_id: int):
    timeline = db.query(models.Timeline).filter(models.Timeline.id == timeline_id, models.Timeline.owner_id == user_id).first()
    if timeline:
        db.delete(timeline)
        db.commit()
        return True
    return False

def delete_event(db: Session, event_id: int, user_id: int):
    event = db.query(models.Event).join(models.Timeline).filter(models.Event.id == event_id, models.Timeline.owner_id == user_id).first()
    if event:
        db.delete(event)
        db.commit()
        return True
    return False
