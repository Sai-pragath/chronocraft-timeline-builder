from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

import models, schemas, crud, auth
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Historical Timeline Builder API")

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me/", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/timelines/", response_model=schemas.Timeline)
def create_timeline(timeline: schemas.TimelineCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_timeline(db=db, timeline=timeline, user_id=current_user.id)

@app.get("/timelines/", response_model=List[schemas.Timeline])
def read_timelines(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_timelines(db, user_id=current_user.id)

@app.get("/timelines/{timeline_id}", response_model=schemas.Timeline)
def read_timeline(timeline_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_timeline = crud.get_timeline(db, timeline_id=timeline_id, user_id=current_user.id)
    if db_timeline is None:
        raise HTTPException(status_code=404, detail="Timeline not found")
    return db_timeline

@app.delete("/timelines/{timeline_id}")
def delete_timeline(timeline_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    success = crud.delete_timeline(db, timeline_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Timeline not found")
    return {"message": "Timeline deleted successfully"}

@app.post("/timelines/{timeline_id}/events/", response_model=schemas.Event)
def create_event_for_timeline(timeline_id: int, event: schemas.EventCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_timeline = crud.get_timeline(db, timeline_id=timeline_id, user_id=current_user.id)
    if db_timeline is None:
        raise HTTPException(status_code=404, detail="Timeline not found")
    return crud.create_event(db=db, event=event, timeline_id=timeline_id)

@app.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    success = crud.delete_event(db, event_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}
