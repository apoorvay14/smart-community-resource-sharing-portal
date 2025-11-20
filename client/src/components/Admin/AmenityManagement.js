import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function AmenityManagement({ user }) {
  const [amenities, setAmenities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Gym',
    capacity: 1,
    pricePerHour: 0,
    availableFrom: '06:00',
    availableTo: '22:00'
  });

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await fetch(`${API_URL}/amenities`);
      const data = await response.json();
      setAmenities(data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${API_URL}/amenities/${editingId}` 
        : `${API_URL}/amenities`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchAmenities();
        resetForm();
        alert(editingId ? 'Amenity updated!' : 'Amenity created!');
      }
    } catch (error) {
      console.error('Error saving amenity:', error);
      alert('Failed to save amenity');
    }
  };

  const handleEdit = (amenity) => {
    setFormData({
      name: amenity.name,
      description: amenity.description,
      type: amenity.type,
      capacity: amenity.capacity,
      pricePerHour: amenity.pricePerHour,
      availableFrom: amenity.availableFrom,
      availableTo: amenity.availableTo
    });
    setEditingId(amenity._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'Gym',
      capacity: 1,
      pricePerHour: 0,
      availableFrom: '06:00',
      availableTo: '22:00'
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
        <h2>📅 Manage Amenities</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: 0 }}
        >
          {showForm ? 'Cancel' : '+ Add Amenity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <div className="form-group">
            <label>Amenity Name</label>
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
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Gym">Gym</option>
              <option value="Pool">Pool</option>
              <option value="Party Hall">Party Hall</option>
              <option value="Garden">Garden</option>
              <option value="Parking">Parking</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Price per Hour ($)</label>
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Available From</label>
              <input
                type="time"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Available To</label>
              <input
                type="time"
                name="availableTo"
                value={formData.availableTo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Amenity' : 'Create Amenity'}
          </button>
        </form>
      )}

      <ul className="card-list">
        {amenities.map((amenity) => (
          <li key={amenity._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h4>{amenity.name}</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  {amenity.description}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-info">{amenity.type}</span>
                  <span className="badge badge-success">${amenity.pricePerHour}/hr</span>
                  <span className="badge badge-warning">Capacity: {amenity.capacity}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
                  Available: {amenity.availableFrom} - {amenity.availableTo}
                </p>
              </div>
              <button 
                onClick={() => handleEdit(amenity)}
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AmenityManagement;
