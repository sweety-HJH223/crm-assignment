import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addInteraction } from '../store/interactionSlice';

const InteractionForm = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    hcp_name: '',
    interaction_type: 'Meeting',
    date: '',
    time: '',
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: 'Neutral',
    outcomes: '',
    follow_up_actions: '',
  });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/interactions/', form);
      dispatch(addInteraction(res.data));
      setSuccess('Interaction logged successfully!');
      setForm({
        hcp_name: '',
        interaction_type: 'Meeting',
        date: '',
        time: '',
        attendees: '',
        topics_discussed: '',
        materials_shared: '',
        samples_distributed: '',
        sentiment: 'Neutral',
        outcomes: '',
        follow_up_actions: '',
      });
    } catch (err) {
      setSuccess('Error logging interaction.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Interaction Details</h2>
      {success && <p style={styles.success}>{success}</p>}

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>HCP Name</label>
          <input style={styles.input} name="hcp_name" value={form.hcp_name}
            onChange={handleChange} placeholder="Search or select HCP..." />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Interaction Type</label>
          <select style={styles.input} name="interaction_type" value={form.interaction_type} onChange={handleChange}>
            <option>Meeting</option>
            <option>Call</option>
            <option>Email</option>
            <option>Conference</option>
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Date</label>
          <input style={styles.input} type="date" name="date" value={form.date} onChange={handleChange} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Time</label>
          <input style={styles.input} type="time" name="time" value={form.time} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Attendees</label>
        <input style={styles.input} name="attendees" value={form.attendees}
          onChange={handleChange} placeholder="Enter names or search..." />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Topics Discussed</label>
        <textarea style={styles.textarea} name="topics_discussed" value={form.topics_discussed}
          onChange={handleChange} placeholder="Enter key discussion points..." />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Materials Shared</label>
        <input style={styles.input} name="materials_shared" value={form.materials_shared}
          onChange={handleChange} placeholder="Enter materials shared..." />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Samples Distributed</label>
        <input style={styles.input} name="samples_distributed" value={form.samples_distributed}
          onChange={handleChange} placeholder="Enter samples distributed..." />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>HCP Sentiment</label>
        <select style={styles.input} name="sentiment" value={form.sentiment} onChange={handleChange}>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Outcomes</label>
        <textarea style={styles.textarea} name="outcomes" value={form.outcomes}
          onChange={handleChange} placeholder="Key outcomes or agreements..." />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Follow-up Actions</label>
        <textarea style={styles.textarea} name="follow_up_actions" value={form.follow_up_actions}
          onChange={handleChange} placeholder="Enter next steps or tasks..." />
      </div>

      <button style={styles.button} onClick={handleSubmit}>Log Interaction</button>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Inter, sans-serif', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a1a2e' },
  row: { display: 'flex', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', marginBottom: '12px', flex: 1 },
  label: { fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#444' },
  input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', fontFamily: 'Inter, sans-serif' },
  textarea: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', minHeight: '80px', fontFamily: 'Inter, sans-serif' },
  button: { background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  success: { color: 'green', marginBottom: '10px' },
};

export default InteractionForm;