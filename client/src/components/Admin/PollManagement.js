import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const PollManagement = ({ user }) => {
  const [polls, setPolls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    options: ['', ''],
    anonymous: false,
    endDate: ''
  });

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/polls`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPolls(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch polls:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          options: validOptions
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Poll created successfully!');
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          category: 'maintenance',
          options: ['', ''],
          anonymous: false,
          endDate: ''
        });
        fetchPolls();
      }
    } catch (error) {
      console.error('Failed to create poll:', error);
      alert('Failed to create poll');
    }
  };

  const closePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/polls/${pollId}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Poll closed successfully!');
        fetchPolls();
      }
    } catch (error) {
      console.error('Failed to close poll:', error);
      alert('Failed to close poll');
    }
  };

  const viewAnalytics = async (pollId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/polls/${pollId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedPoll(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="poll-management">
      <h2>📊 Poll Management</h2>
      <p className="subtitle">Create and manage community polls</p>

      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? 'Cancel' : '+ Create New Poll'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="poll-form">
          <h3>Create New Poll</h3>
          
          <div className="form-group">
            <label>Poll Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Should we renovate the gym?"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about the poll..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="maintenance">Maintenance</option>
              <option value="budget">Budget</option>
              <option value="amenity">Amenity</option>
              <option value="rules">Rules</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Options * (at least 2)</label>
            {formData.options.map((option, index) => (
              <div key={index} className="option-input">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {formData.options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)} className="btn-danger">
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption} className="btn-secondary">
              + Add Option
            </button>
          </div>

          <div className="form-group">
            <label>End Date (Optional)</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
              />
              Anonymous Voting (hide voter identities)
            </label>
          </div>

          <button type="submit" className="btn-primary">Create Poll</button>
        </form>
      )}

      {selectedPoll && (
        <div className="analytics-modal">
          <div className="modal-content">
            <button onClick={() => setSelectedPoll(null)} className="close-btn">×</button>
            <h3>Poll Analytics: {selectedPoll.poll.title}</h3>
            
            <div className="analytics-stats">
              <div className="stat-box">
                <span className="stat-number">{selectedPoll.analytics.totalVotes}</span>
                <span className="stat-label">Total Votes</span>
              </div>
            </div>

            <h4>Results Breakdown</h4>
            {selectedPoll.analytics.options.map((option, index) => (
              <div key={index} className="result-item">
                <div className="result-header">
                  <span>{option.text}</span>
                  <span>{option.votes} votes ({option.percentage}%)</span>
                </div>
                <div className="result-bar">
                  <div className="result-fill" style={{ width: `${option.percentage}%` }}></div>
                </div>
              </div>
            ))}

            {!selectedPoll.poll.anonymous && selectedPoll.analytics.votingPattern && selectedPoll.analytics.votingPattern.length > 0 && (
              <div>
                <h4>Voting Pattern</h4>
                <div className="voting-pattern">
                  {selectedPoll.analytics.votingPattern.map((vote, index) => (
                    <div key={index} className="vote-entry">
                      <span>{vote.user}</span>
                      <span>→</span>
                      <span>{vote.option}</span>
                      <span className="vote-time">{new Date(vote.votedAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!selectedPoll.poll.anonymous && (!selectedPoll.analytics.votingPattern || selectedPoll.analytics.votingPattern.length === 0) && (
              <div>
                <h4>Voting Pattern</h4>
                <p style={{ color: '#999' }}>No votes yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="polls-list">
        <h3>All Polls</h3>
        {polls.length === 0 ? (
          <p>No polls created yet.</p>
        ) : (
          polls.map(poll => (
            <div key={poll._id} className="card poll-item">
              <div className="poll-header">
                <h4>{poll.title}</h4>
                <span className={`badge ${poll.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                  {poll.status}
                </span>
              </div>
              <p>{poll.description}</p>
              <div className="poll-meta">
                <span>📊 Category: {poll.category}</span>
                <span>🗳️ Votes: {poll.votes.length}</span>
                <span>👤 By: {poll.createdBy.name}</span>
              </div>
              <div className="poll-actions">
                <button onClick={() => viewAnalytics(poll._id)} className="btn-primary">
                  View Analytics
                </button>
                {poll.status === 'active' && (
                  <button onClick={() => closePoll(poll._id)} className="btn-danger">
                    Close Poll
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PollManagement;
