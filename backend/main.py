from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, engine
from models import Base, Interaction
from schemas import InteractionCreate, InteractionUpdate, InteractionResponse, ChatMessage
from agent import run_agent
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CRM HCP Module")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "CRM HCP Module API is running"}

@app.post("/interactions/", response_model=InteractionResponse)
def create_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = Interaction(**interaction.dict())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@app.get("/interactions/")
def get_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).all()

@app.get("/interactions/{interaction_id}")
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@app.put("/interactions/{interaction_id}")
def update_interaction(interaction_id: int, interaction: InteractionUpdate, db: Session = Depends(get_db)):
    db_interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    for key, value in interaction.dict(exclude_unset=True).items():
        setattr(db_interaction, key, value)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@app.delete("/interactions/{interaction_id}")
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    db.delete(interaction)
    db.commit()
    return {"message": "Interaction deleted"}

@app.post("/chat/")
def chat_with_agent(message: ChatMessage):
    response = run_agent(message.message)
    return {"response": response}