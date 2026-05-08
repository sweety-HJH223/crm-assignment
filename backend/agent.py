from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
from typing import Optional
import os
import json

load_dotenv()

llm = ChatGroq(
    model="llama3-70b-8192",
    api_key=os.getenv("GROQ_API_KEY"),
    timeout=60,
    max_retries=2
)

# Tool 1: Log Interaction
@tool
def log_interaction(
    hcp_name: str,
    interaction_type: Optional[str] = "Meeting",
    date: Optional[str] = None,
    time: Optional[str] = None,
    attendees: Optional[str] = None,
    topics_discussed: Optional[str] = None,
    materials_shared: Optional[str] = None,
    samples_distributed: Optional[str] = None,
    sentiment: Optional[str] = "Neutral",
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[str] = None
) -> str:
    """Log a new HCP interaction. Provide hcp_name and any available details like topics_discussed, sentiment, materials_shared."""
    try:
        from database import SessionLocal
        from models import Interaction

        db = SessionLocal()
        interaction = Interaction(
            hcp_name=hcp_name,
            interaction_type=interaction_type or "Meeting",
            date=date or "",
            time=time or "",
            attendees=attendees or "",
            topics_discussed=topics_discussed or "",
            materials_shared=materials_shared or "",
            samples_distributed=samples_distributed or "",
            sentiment=sentiment or "Neutral",
            outcomes=outcomes or "",
            follow_up_actions=follow_up_actions or ""
        )
        db.add(interaction)
        db.commit()
        db.refresh(interaction)
        interaction_id = interaction.id
        db.close()
        return f"Interaction logged successfully with ID: {interaction_id}"
    except Exception as e:
        return f"Error logging interaction: {str(e)}"


# Tool 2: Edit Interaction
@tool
def edit_interaction(
    interaction_id: str,
    hcp_name: Optional[str] = None,
    interaction_type: Optional[str] = None,
    date: Optional[str] = None,
    topics_discussed: Optional[str] = None,
    materials_shared: Optional[str] = None,
    sentiment: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[str] = None
) -> str:
    """Edit an existing HCP interaction by its ID. Provide the interaction_id and fields to update."""
    try:
        from database import SessionLocal
        from models import Interaction

        db = SessionLocal()
        interaction = db.query(Interaction).filter(
            Interaction.id == int(interaction_id)
        ).first()

        if not interaction:
            return f"Interaction with ID {interaction_id} not found"

        if hcp_name: interaction.hcp_name = hcp_name
        if interaction_type: interaction.interaction_type = interaction_type
        if date: interaction.date = date
        if topics_discussed: interaction.topics_discussed = topics_discussed
        if materials_shared: interaction.materials_shared = materials_shared
        if sentiment: interaction.sentiment = sentiment
        if outcomes: interaction.outcomes = outcomes
        if follow_up_actions: interaction.follow_up_actions = follow_up_actions

        db.commit()
        db.close()
        return f"Interaction {interaction_id} updated successfully"
    except Exception as e:
        return f"Error editing interaction: {str(e)}"


# Tool 3: Get HCP History
@tool
def get_hcp_history(hcp_name: str) -> str:
    """Get all past logged interactions for a specific HCP by their name."""
    try:
        from database import SessionLocal
        from models import Interaction

        db = SessionLocal()
        interactions = db.query(Interaction).filter(
            Interaction.hcp_name.ilike(f"%{hcp_name}%")
        ).all()
        db.close()

        if not interactions:
            return f"No interactions found for {hcp_name}"

        result = []
        for i in interactions:
            result.append({
                "id": i.id,
                "date": i.date,
                "type": i.interaction_type,
                "topics": i.topics_discussed,
                "sentiment": i.sentiment,
                "outcomes": i.outcomes
            })

        return json.dumps(result, indent=2)
    except Exception as e:
        return f"Error fetching history: {str(e)}"


# Tool 4: Suggest Follow-ups
@tool
def suggest_followups(interaction_summary: str) -> str:
    """Suggest 3 specific follow-up actions for a pharma sales rep based on an HCP interaction summary."""
    try:
        response = llm.invoke(
            f"Based on this HCP interaction summary, suggest 3 specific follow-up actions for a pharma sales rep: {interaction_summary}"
        )
        return response.content
    except Exception as e:
        return f"Error suggesting follow-ups: {str(e)}"


# Tool 5: Analyze Sentiment
@tool
def analyze_sentiment(interaction_text: str) -> str:
    """Analyze and return the sentiment of an HCP interaction as exactly one word: Positive, Neutral, or Negative."""
    try:
        response = llm.invoke(
            f"Analyze the sentiment of this HCP interaction and respond with only one word - Positive, Neutral, or Negative: {interaction_text}"
        )
        return response.content.strip()
    except Exception as e:
        return f"Error analyzing sentiment: {str(e)}"


# Create LangGraph Agent
tools = [log_interaction, edit_interaction, get_hcp_history, suggest_followups, analyze_sentiment]
agent = create_react_agent(llm, tools)


def run_agent(message: str) -> str:
    """Run the LangGraph agent with a user message."""
    try:
        print(f"[DEBUG] Received message: {message}")

        system_prompt = """You are a CRM assistant for pharma sales reps.
When the user describes an HCP interaction, you MUST immediately call the log_interaction tool.
Extract as many fields as possible: hcp_name, interaction_type, date, topics_discussed, materials_shared, sentiment, outcomes, follow_up_actions.
- hcp_name is REQUIRED. Always extract it from the message.
- sentiment must be one of: Positive, Neutral, Negative.
- interaction_type must be one of: Meeting, Phone Call, Email, Conference, Virtual Call.
Never respond with plain text when you can use a tool. Always use tools."""

        print("[DEBUG] Calling agent...")
        result = agent.invoke({
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        })
        print(f"[DEBUG] Agent responded successfully")
        return result["messages"][-1].content
    except Exception as e:
        print(f"[DEBUG] Error: {str(e)}")
        return f"Agent error: {str(e)}"