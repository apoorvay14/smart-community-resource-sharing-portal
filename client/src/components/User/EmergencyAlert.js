import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const EmergencyAlert = ({ user }) => {
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'security',
    severity: 'high',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchMyAlerts();
  }, []);

  const fetchMyAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const sendPanicAlert = async () => {
    if (!window.confirm('⚠️ Are you sure you want to send a PANIC alert? This will notify security immediately.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'emergency',
          severity: 'critical',
          location: 'User location',
          description: 'PANIC BUTTON - Immediate assistance required',
          isPanic: true
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('🚨 PANIC ALERT SENT! Security has been notified.');
        fetchMyAlerts();
      }
    } catch (error) {
      console.error('Failed to send panic alert:', error);
      alert('Failed to send panic alert');
    }
  };

  const sendQuickAlert = async (type) => {
    const quickAlerts = {
      security: { type: 'security', description: 'Security concern requiring attention', severity: 'high' },
      fire: { type: 'fire', description: 'Fire or smoke detected', severity: 'critical' },
      medical: { type: 'medical', description: 'Medical emergency requiring assistance', severity: 'critical' },
      maintenance: { type: 'maintenance', description: 'Urgent maintenance issue', severity: 'high' }
    };

    const alertData = quickAlerts[type];
    const location = prompt(`Enter location for ${type} alert:`);
    if (!location) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...alertData,
          location
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Alert sent successfully!');
        fetchMyAlerts();
      }
    } catch (error) {
      console.error('Failed to send alert:', error);
      alert('Failed to send alert');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert('Alert created successfully!');
        setShowForm(false);
        setFormData({
          type: 'security',
          severity: 'high',
          location: '',
          description: ''
        });
        fetchMyAlerts();
      }
    } catch (error) {
      console.error('Failed to create alert:', error);
      alert('Failed to create alert');
    }
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      critical: 'badge-danger',
      high: 'badge-warning',
      medium: 'badge-info',
      low: 'badge-secondary'
    };
    return <span className={`badge ${badges[severity]}`}>{severity.toUpperCase()}</span>;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-danger',
      acknowledged: 'badge-warning',
      resolved: 'badge-success',
      false_alarm: 'badge-secondary'
    };
    return <span className={`badge ${badges[status]}`}>{status.replace('_', ' ').toUpperCase()}</span>;
  };

  return (
    <div className="emergency-alert">
      <h2>🚨 Emergency Alert System</h2>
      <p className="subtitle">Quick access to emergency services and alerts</p>

      <div className="panic-section">
        <button onClick={sendPanicAlert} className="panic-button">
          🚨 PANIC BUTTON
        </button>
        <p style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: '10px' }}>
          Press only in case of immediate danger
        </p>
      </div>

      <div className="quick-alerts">
        <h3>Quick Alerts</h3>
        <div className="alert-buttons">
          <button onClick={() => sendQuickAlert('security')} className="alert-btn security">
            👮 Security Issue
          </button>
          <button onClick={() => sendQuickAlert('fire')} className="alert-btn fire">
            🔥 Fire Alert
          </button>
          <button onClick={() => sendQuickAlert('medical')} className="alert-btn medical">
            🏥 Medical Emergency
          </button>
          <button onClick={() => sendQuickAlert('maintenance')} className="alert-btn maintenance">
            🔧 Urgent Maintenance
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Create Detailed Alert'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="alert-form">
          <h3>Create Alert</h3>
          
          <div className="form-group">
            <label>Alert Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="security">Security</option>
              <option value="fire">Fire</option>
              <option value="medical">Medical</option>
              <option value="maintenance">Maintenance</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Severity *</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Block A, Apt 301"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the situation..."
              rows="4"
              required
            />
          </div>

          <button type="submit" className="btn-primary">Submit Alert</button>
        </form>
      )}

      <div className="my-alerts" style={{ marginTop: '30px' }}>
        <h3>My Alert History</h3>
        {alerts.length === 0 ? (
          <p>No alerts sent yet.</p>
        ) : (
          <div className="alerts-list">
            {alerts.map(alert => (
              <div key={alert._id} className="card alert-item">
                <div className="alert-header">
                  <div>
                    <h4>{alert.type.toUpperCase()}</h4>
                    {alert.isPanic && <span className="badge badge-danger">PANIC</span>}
                  </div>
                  <div>
                    {getSeverityBadge(alert.severity)}
                    {getStatusBadge(alert.status)}
                  </div>
                </div>
                <p><strong>Location:</strong> {alert.location}</p>
                <p><strong>Description:</strong> {alert.description}</p>
                <p><strong>Reported:</strong> {new Date(alert.createdAt).toLocaleString()}</p>
                {alert.acknowledgedAt && (
                  <p><strong>Acknowledged:</strong> {new Date(alert.acknowledgedAt).toLocaleString()}</p>
                )}
                {alert.resolvedAt && (
                  <>
                    <p><strong>Resolved:</strong> {new Date(alert.resolvedAt).toLocaleString()}</p>
                    <p><strong>Resolution:</strong> {alert.resolution}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyAlert;
