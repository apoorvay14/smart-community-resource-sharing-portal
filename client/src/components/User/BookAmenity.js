import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function BookAmenity({ user }) {
  const [amenities, setAmenities] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });

  useEffect(() => {
    fetchAmenities();
    fetchMyBookings();
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

  const fetchMyBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();
      // Filter to show only current user's bookings
      const userBookings = data.filter(booking => {
        const bookingUserId = booking.user?._id || booking.user;
        return bookingUserId === user.id;
      });
      setMyBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookClick = (amenity) => {
    setSelectedAmenity(amenity);
    setShowForm(true);
    setFormData({
      bookingDate: '',
      startTime: amenity.availableFrom || '06:00',
      endTime: amenity.availableTo || '22:00',
      purpose: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAmenity) return;

    try {
      const startHour = parseInt(formData.startTime.split(':')[0]);
      const endHour = parseInt(formData.endTime.split(':')[0]);
      const hours = endHour - startHour;
      const totalAmount = hours * selectedAmenity.pricePerHour;

      const bookingData = {
        amenity: selectedAmenity._id,
        user: user.id,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        totalAmount,
        status: 'confirmed'
      };

      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert(`Booking confirmed! Total: $${totalAmount}`);
        fetchMyBookings();
        setShowForm(false);
        setSelectedAmenity(null);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    }
  };

  return (
    <div>
      <div className="card">
        <h2>📅 Available Amenities</h2>
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
                  onClick={() => handleBookClick(amenity)}
                  style={{
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  Book Now
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && selectedAmenity && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>Book {selectedAmenity.name}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Booking Date</label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Purpose (Optional)</label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows="3"
                placeholder="Describe the purpose of your booking..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Confirm Booking
              </button>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setSelectedAmenity(null); }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>🎫 My Bookings</h2>
        {myBookings.length > 0 ? (
          <ul className="card-list">
            {myBookings.map((booking) => (
              <li key={booking._id}>
                <h4>{booking.amenity?.name || 'Amenity'}</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Date: {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                  Time: {booking.startTime} - {booking.endTime}
                </p>
                {booking.purpose && (
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Purpose: {booking.purpose}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span className={`badge badge-${
                    booking.status === 'confirmed' ? 'success' : 
                    booking.status === 'pending' ? 'warning' : 'info'
                  }`}>
                    {booking.status}
                  </span>
                  <span className="badge badge-info">${booking.totalAmount}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999' }}>No bookings yet</p>
        )}
      </div>
    </div>
  );
}

export default BookAmenity;
