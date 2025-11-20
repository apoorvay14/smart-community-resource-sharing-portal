import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function AnnouncementManagement({ user }) {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_URL}/announcements`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, postedBy: user.id };
      
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        fetchAnnouncements();
        resetForm();
        alert('Announcement created!');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 'medium'
    });
    setShowForm(false);
  };

  if (user?.role !== 'admin') {
    return <div className="card"><p>Admin access required</p></div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>📢 Manage Announcements</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: 0 }}
        >
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Announcement title"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Write your announcement here..."
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="general">General</option>
              <option value="urgent">Urgent</option>
              <option value="event">Event</option>
              <option value="maintenance">Maintenance</option>
              <option value="notice">Notice</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Post Announcement
          </button>
        </form>
      )}

      <ul className="card-list">
        {announcements.map((announcement) => (
          <li key={announcement._id}>
            <div>
              <h4>{announcement.title}</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                {announcement.content}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className={`badge badge-${
                  announcement.type === 'urgent' ? 'danger' : 
                  announcement.type === 'event' ? 'info' : 'success'
                }`}>
                  {announcement.type}
                </span>
                <span className={`badge badge-${
                  announcement.priority === 'high' ? 'danger' : 
                  announcement.priority === 'medium' ? 'warning' : 'info'
                }`}>
                  {announcement.priority} priority
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                Posted: {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnnouncementManagement;
