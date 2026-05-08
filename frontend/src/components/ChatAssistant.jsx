import React, { useState } from 'react';
import axios from 'axios';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I can help you log interactions. Try: "Met Dr. Smith today, discussed Product X efficacy, positive sentiment."' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/chat/', { message: input });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to agent.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.dot}>🤖</span>
        <div>
          <p style={styles.title}>AI Assistant</p>
          <p style={styles.subtitle}>Log interaction via chat</p>
        </div>
      </div>

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.assistantMsg}>
            {msg.text}
          </div>
        ))}
        {loading && <div style={styles.assistantMsg}>Thinking...</div>}
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe interaction..."
        />
        <button style={styles.button} onClick={sendMessage}>Log</button>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Inter, sans-serif', padding: '20px', background: '#f8f9ff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', height: '100%' },
  header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' },
  dot: { fontSize: '24px' },
  title: { margin: 0, fontWeight: '600', fontSize: '15px', color: '#1a1a2e' },
  subtitle: { margin: 0, fontSize: '12px', color: '#888' },
  messages: { flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '300px', maxHeight: '400px' },
  userMsg: { alignSelf: 'flex-end', background: '#4f46e5', color: '#fff', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', maxWidth: '80%', fontSize: '14px' },
  assistantMsg: { alignSelf: 'flex-start', background: '#fff', color: '#333', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', maxWidth: '80%', fontSize: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  inputRow: { display: 'flex', gap: '8px' },
  input: { flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'Inter, sans-serif' },
  button: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
};

export default ChatAssistant;