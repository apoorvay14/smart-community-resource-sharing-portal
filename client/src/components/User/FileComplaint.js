import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function FileComplaint({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Maintenance',
    priority: 'medium',
    location: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${API_URL}/complaints`);
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const complaintData = {
        ...formData,
        reportedBy: user.id
      };

      const response = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });

      if (response.ok) {
        alert('Complaint filed successfully!');
        fetchComplaints();
        resetForm();
      } else {
        alert('Failed to file complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error filing complaint:', error);
      alert('Failed to file complaint');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Maintenance',
      priority: 'medium',
      location: ''
    });
    setShowForm(false);
  };

  const myComplaints = complaints.filter(c => c.reportedBy?._id === user.id || c.reportedBy === user.id);

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>📝 File a Complaint</h2>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: 0 }}
          >
            {showForm ? 'Cancel' : '+ New Complaint'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe the issue in detail..."
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Maintenance">Maintenance</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Security">Security</option>
                <option value="Noise">Noise</option>
                <option value="Parking">Parking</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Building A - Floor 3"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Complaint
            </button>
          </form>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>📋 My Complaints</h2>
        {myComplaints.length > 0 ? (
          <ul className="card-list">
            {myComplaints.map((complaint) => (
              <li key={complaint._id}>
                <div>
                  <h4>{complaint.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    {complaint.description}
                  </p>
                  {complaint.location && (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      📍 Location: {complaint.location}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <span className="badge badge-info">{complaint.category}</span>
                    <span className={`badge badge-${
                      complaint.status === 'resolved' ? 'success' :
                      complaint.status === 'in-progress' ? 'warning' : 'danger'
                    }`}>
                      {complaint.status}
                    </span>
                    <span className={`badge badge-${
                      complaint.priority === 'urgent' ? 'danger' :
                      complaint.priority === 'high' ? 'warning' : 'info'
                    }`}>
                      {complaint.priority} priority
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                    Filed: {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999' }}>No complaints filed yet</p>
        )}
      </div>

      {user.role === 'admin' && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>🔧 All Complaints (Admin View)</h2>
          {complaints.length > 0 ? (
            <ul className="card-list">
              {complaints.map((complaint) => (
                <li key={complaint._id}>
                  <div>
                    <h4>{complaint.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      {complaint.description}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      Reported by: {complaint.reportedBy?.name || 'Unknown'} 
                      {complaint.reportedBy?.flatNumber && ` (${complaint.reportedBy.flatNumber})`}
                    </p>
                    {complaint.location && (
                      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                        📍 {complaint.location}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-info">{complaint.category}</span>
                      <span className={`badge badge-${
                        complaint.status === 'resolved' ? 'success' :
                        complaint.status === 'in-progress' ? 'warning' : 'danger'
                      }`}>
                        {complaint.status}
                      </span>
                      <span className={`badge badge-${
                        complaint.priority === 'urgent' ? 'danger' :
                        complaint.priority === 'high' ? 'warning' : 'info'
                      }`}>
                        {complaint.priority}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#999' }}>No complaints yet</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FileComplaint;
