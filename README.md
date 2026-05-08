# AI-First CRM HCP Module – Log Interaction Screen

A full-stack AI-powered CRM system for pharma field representatives to log Healthcare Professional (HCP) interactions using either a structured form or a conversational AI chat interface.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Redux |
| Backend | Python, FastAPI |
| AI Agent | LangGraph |
| LLM | Groq (llama-3.3-70b-versatile) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Font | Google Inter |

---

## 📁 Project Structure

```
crm-assignment/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InteractionForm.jsx   # Left panel - structured form
│   │   │   └── ChatAssistant.jsx     # Right panel - AI chat
│   │   ├── store/
│   │   │   ├── store.js              # Redux store
│   │   │   └── interactionSlice.js   # Redux slice
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── backend/
    ├── main.py         # FastAPI app & endpoints
    ├── agent.py        # LangGraph agent & 5 tools
    ├── models.py       # SQLAlchemy models
    ├── database.py     # DB connection
    ├── schemas.py      # Pydantic schemas
    └── .env            # API keys (not committed)
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 16
- Python >= 3.10
- Groq API Key (https://console.groq.com)

---

### Backend Setup

```bash
# Navigate to backend
cd crm-assignment/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy langchain langchain-groq langgraph python-dotenv pydantic

# Create .env file
echo GROQ_API_KEY=your_groq_api_key_here > .env
echo DATABASE_URL=sqlite:///./crm.db >> .env

# Start backend server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
API Docs at: **http://localhost:8000/docs**

---

### Frontend Setup

```bash
# Navigate to frontend
cd crm-assignment/frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🤖 LangGraph Agent & Tools

The LangGraph agent acts as an intelligent middleware between the user and the CRM database. It processes natural language input and routes it to the appropriate tool.

### Tool 1: `log_interaction`
Captures HCP interaction data from natural language. Uses the LLM to extract fields like HCP name, topics discussed, sentiment, and materials shared, then saves to the database.

### Tool 2: `edit_interaction`
Allows modification of previously logged interactions by ID. The LLM identifies which fields need updating from the user's message.

### Tool 3: `get_hcp_history`
Retrieves all past interactions for a specific HCP from the database and returns a structured summary.

### Tool 4: `suggest_followups`
Uses the LLM to analyze an interaction summary and generate 3 specific, actionable follow-up recommendations for the sales rep.

### Tool 5: `analyze_sentiment`
Analyzes the tone and sentiment of an interaction description and classifies it as Positive, Neutral, or Negative.

---

## 🖥️ Features

- **Dual Interface**: Log interactions via structured form OR natural language chat
- **AI Auto-fill**: Describe an interaction in chat and AI extracts all form fields
- **Sentiment Analysis**: Automatic HCP sentiment detection
- **Follow-up Suggestions**: AI-generated next steps after each interaction
- **Interaction History**: View all past interactions per HCP
- **Redux State Management**: Centralized state for form and chat data

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/interactions/` | Create new interaction |
| GET | `/interactions/` | Get all interactions |
| GET | `/interactions/{id}` | Get interaction by ID |
| PUT | `/interactions/{id}` | Update interaction |
| DELETE | `/interactions/{id}` | Delete interaction |
| POST | `/chat/` | Send message to AI agent |

---

## 💬 Example Chat Commands

```
"Met Dr. Smith today, discussed OncoBoost efficacy, positive sentiment"
"Show history for Dr. Patel"
"Edit interaction ID 1, update sentiment to Positive"
"Suggest follow-ups for my meeting with Dr. Smith"
"Analyze sentiment: Dr. Johnson was very enthusiastic about the product"
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend folder:

```dotenv
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=sqlite:///./crm.db
```

---

## 📝 Notes

- The assignment uses Groq's free tier which has token limits. If you hit rate limits, wait a few minutes and retry.
- SQLite is used for development. For production, switch DATABASE_URL to PostgreSQL.
- The LangGraph agent uses `llama-3.3-70b-versatile` for best tool-calling accuracy.