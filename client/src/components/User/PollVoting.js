import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const PollVoting = ({ user }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const hasVoted = (poll) => {
    return poll.votes.some(vote => vote.user === user.id || vote.user._id === user.id);
  };

  const vote = async (pollId, optionIndex) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ optionIndex })
      });
      const data = await response.json();
      if (data.success) {
        alert('Vote submitted successfully!');
        fetchPolls();
        setSelectedPoll(null);
        setSelectedOption(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to submit vote');
    }
  };

  const getStatusBadge = (poll) => {
    if (poll.status === 'active') {
      return <span className="badge badge-success">Active</span>;
    } else if (poll.status === 'closed') {
      return <span className="badge badge-secondary">Closed</span>;
    } else {
      return <span className="badge badge-info">Draft</span>;
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      maintenance: '🔧',
      budget: '💰',
      amenity: '🏢',
      rules: '📋',
      event: '🎉',
      other: '📊'
    };
    return icons[category] || '📊';
  };

  if (loading) {
    return <div>Loading polls...</div>;
  }

  return (
    <div className="poll-voting">
      <h2>📊 Community Polls & Voting</h2>
      <p className="subtitle">Participate in community decisions</p>

      {selectedPoll ? (
        <div className="poll-detail">
          <button onClick={() => setSelectedPoll(null)} className="btn-secondary" style={{ marginBottom: '20px' }}>
            ← Back to Polls
          </button>
          
          <div className="card">
            <h3>{selectedPoll.title}</h3>
            <p>{selectedPoll.description}</p>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ marginRight: '10px' }}>{getCategoryIcon(selectedPoll.category)} {selectedPoll.category}</span>
              {getStatusBadge(selectedPoll)}
              {selectedPoll.anonymous && <span className="badge badge-info" style={{ marginLeft: '5px' }}>Anonymous</span>}
            </div>

            {hasVoted(selectedPoll) ? (
              <div>
                <h4>Results:</h4>
                <div className="poll-results">
                  {selectedPoll.options.map((option, index) => {
                    const totalVotes = selectedPoll.votes.length;
                    const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0;
                    return (
                      <div key={index} className="poll-result-item">
                        <div className="result-label">
                          <span>{option.text}</span>
                          <span>{option.votes} votes ({percentage}%)</span>
                        </div>
                        <div className="result-bar">
                          <div 
                            className="result-fill" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p style={{ marginTop: '20px', color: '#666' }}>
                  Total votes: {selectedPoll.votes.length}
                </p>
              </div>
            ) : (
              <div>
                <h4>Cast Your Vote:</h4>
                <div className="poll-options">
                  {selectedPoll.options.map((option, index) => (
                    <div key={index} className="poll-option">
                      <label>
                        <input
                          type="radio"
                          name="poll-option"
                          checked={selectedOption === index}
                          onChange={() => setSelectedOption(index)}
                        />
                        <span>{option.text}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => vote(selectedPoll._id, selectedOption)}
                  disabled={selectedOption === null || selectedPoll.status !== 'active'}
                  className="btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  Submit Vote
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="polls-grid">
          {polls.length === 0 ? (
            <p>No polls available at the moment.</p>
          ) : (
            polls.map(poll => (
              <div key={poll._id} className="card poll-card">
                <div className="poll-header">
                  <h3>{poll.title}</h3>
                  <div>
                    {getStatusBadge(poll)}
                    {hasVoted(poll) && <span className="badge badge-info" style={{ marginLeft: '5px' }}>Voted ✓</span>}
                  </div>
                </div>
                <p>{poll.description.substring(0, 100)}...</p>
                <div className="poll-meta">
                  <span>{getCategoryIcon(poll.category)} {poll.category}</span>
                  <span>📊 {poll.votes.length} votes</span>
                  {poll.anonymous && <span>🔒 Anonymous</span>}
                </div>
                <button 
                  onClick={() => setSelectedPoll(poll)}
                  className="btn-primary"
                  style={{ marginTop: '10px' }}
                >
                  {hasVoted(poll) ? 'View Results' : 'Vote Now'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PollVoting;
