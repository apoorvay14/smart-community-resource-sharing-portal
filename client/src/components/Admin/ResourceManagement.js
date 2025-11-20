import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function ResourceManagement({ user }) {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Tools',
    condition: 'good',
    status: 'available'
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API_URL}/resources`);
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData, owner: user.id };
      const url = editingId 
        ? `${API_URL}/resources/${editingId}` 
        : `${API_URL}/resources`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        fetchResources();
        resetForm();
        alert(editingId ? 'Resource updated!' : 'Resource created!');
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    setFormData({
      name: resource.name,
      description: resource.description,
      category: resource.category,
      condition: resource.condition,
      status: resource.status
    });
    setEditingId(resource._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchResources();
        alert('Resource deleted!');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Tools',
      condition: 'good',
      status: 'available'
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (user?.role !== 'admin') {
    return <div className="card"><p>Admin access required</p></div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>🤝 Manage Resources</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: 0 }}
        >
          {showForm ? 'Cancel' : '+ Add Resource'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <div className="form-group">
            <label>Resource Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Tools">Tools</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Sports">Sports</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Condition</label>
            <select name="condition" value={formData.condition} onChange={handleChange}>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Resource' : 'Create Resource'}
          </button>
        </form>
      )}

      <ul className="card-list">
        {resources.map((resource) => (
          <li key={resource._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h4>{resource.name}</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  {resource.description}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-info">{resource.category}</span>
                  <span className={`badge badge-${resource.status === 'available' ? 'success' : 'warning'}`}>
                    {resource.status}
                  </span>
                  <span className="badge badge-secondary">{resource.condition}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleEdit(resource)}
                  style={{
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(resource._id)}
                  style={{
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResourceManagement;
