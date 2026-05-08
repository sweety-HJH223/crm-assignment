import React from 'react';
import { useSelector } from 'react-redux';
import InteractionForm from './components/InteractionForm';
import ChatAssistant from './components/ChatAssistant';
import './App.css';

function App() {
  const { interactions } = useSelector(state => state.interaction);

  return (
    <div className="app">
      <div className="header">
        <h1>Log HCP Interaction</h1>
      </div>
      <div className="main">
        <div className="left">
          <InteractionForm />
        </div>
        <div className="right">
          <ChatAssistant />
        </div>
      </div>
      {interactions.length > 0 && (
        <div className="logged">
          <h3>Logged Interactions ({interactions.length})</h3>
          {interactions.map((i, idx) => (
            <div key={idx} className="interaction-card">
              <strong>{i.hcp_name}</strong> — {i.interaction_type} on {i.date}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;