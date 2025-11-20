import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const AlertManagement = ({ user }) => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all' 
        ? `${API_URL}/alerts`
        : `${API_URL}/alerts?status=${filter}`;
      
      const response = await fetch(url, {
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

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts/${alertId}/acknowledge`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Alert acknowledged');
        fetchAlerts();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const resolveAlert = async (alertId) => {
    if (!resolution.trim()) {
      alert('Please provide resolution details');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts/${alertId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resolution })
      });
      const data = await response.json();
      if (data.success) {
        alert('Alert resolved successfully');
        setSelectedAlert(null);
        setResolution('');
        fetchAlerts();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const markFalseAlarm = async (alertId) => {
    if (!window.confirm('Mark this as a false alarm?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts/${alertId}/false-alarm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Marked as false alarm');
        fetchAlerts();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to mark false alarm:', error);
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

  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="alert-management">
      <h2>🚨 Emergency Alert Management</h2>
      <p className="subtitle">Monitor and respond to community alerts</p>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Alerts</span>
          </div>
          <div className="stat-card active">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card acknowledged">
            <span className="stat-number">{stats.acknowledged}</span>
            <span className="stat-label">Acknowledged</span>
          </div>
          <div className="stat-card resolved">
            <span className="stat-number">{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
          <div className="stat-card critical">
            <span className="stat-number">{stats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
          <div className="stat-card panic">
            <span className="stat-number">{stats.panic}</span>
            <span className="stat-label">Panic Alerts</span>
          </div>
        </div>
      )}

      <div className="filter-section">
        <label>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Alerts</option>
          <option value="active">Active</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {selectedAlert && (
        <div className="resolve-modal">
          <div className="modal-content">
            <h3>Resolve Alert</h3>
            <p><strong>Type:</strong> {selectedAlert.type}</p>
            <p><strong>Location:</strong> {selectedAlert.location}</p>
            <p><strong>Description:</strong> {selectedAlert.description}</p>
            
            <div className="form-group">
              <label>Resolution Details *</label>
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Describe how the issue was resolved..."
                rows="4"
              />
            </div>
            
            <div className="modal-actions">
              <button onClick={() => resolveAlert(selectedAlert._id)} className="btn-primary">
                Submit Resolution
              </button>
              <button onClick={() => setSelectedAlert(null)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="alerts-grid">
        {alerts.length === 0 ? (
          <p>No alerts found.</p>
        ) : (
          alerts.map(alert => (
            <div key={alert._id} className={`card alert-card ${alert.isPanic ? 'panic-alert' : ''}`}>
              <div className="alert-header">
                <div>
                  <h3>{alert.type.toUpperCase()}</h3>
                  {alert.isPanic && <span className="badge badge-danger">⚠️ PANIC</span>}
                </div>
                <div>
                  {getSeverityBadge(alert.severity)}
                  {getStatusBadge(alert.status)}
                </div>
              </div>

              <div className="alert-details">
                <p><strong>Location:</strong> {alert.location}</p>
                <p><strong>Description:</strong> {alert.description}</p>
                <p><strong>Reported by:</strong> {alert.reportedBy?.name} ({alert.reportedBy?.phone || alert.reportedBy?.email})</p>
                <p><strong>Reported at:</strong> {new Date(alert.createdAt).toLocaleString()}</p>
                
                {alert.acknowledgedAt && (
                  <p><strong>Acknowledged at:</strong> {new Date(alert.acknowledgedAt).toLocaleString()}</p>
                )}
                
                {alert.resolvedAt && (
                  <>
                    <p><strong>Resolved at:</strong> {new Date(alert.resolvedAt).toLocaleString()}</p>
                    <p><strong>Resolution:</strong> {alert.resolution}</p>
                  </>
                )}
              </div>

              <div className="alert-actions">
                {alert.status === 'active' && (
                  <>
                    <button onClick={() => acknowledgeAlert(alert._id)} className="btn-warning">
                      Acknowledge
                    </button>
                    <button onClick={() => setSelectedAlert(alert)} className="btn-success">
                      Resolve
                    </button>
                    <button onClick={() => markFalseAlarm(alert._id)} className="btn-secondary">
                      False Alarm
                    </button>
                  </>
                )}
                
                {alert.status === 'acknowledged' && (
                  <>
                    <button onClick={() => setSelectedAlert(alert)} className="btn-success">
                      Resolve
                    </button>
                    <button onClick={() => markFalseAlarm(alert._id)} className="btn-secondary">
                      False Alarm
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertManagement;
