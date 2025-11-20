import React, { useState, useEffect } from 'react';
import AmenityManagement from '../Admin/AmenityManagement';
import ResourceManagement from '../Admin/ResourceManagement';
import AnnouncementManagement from '../Admin/AnnouncementManagement';
import PollManagement from '../Admin/PollManagement';
import AlertManagement from '../Admin/AlertManagement';
import BookAmenity from '../User/BookAmenity';
import FileComplaint from '../User/FileComplaint';
import Chatbot from '../User/Chatbot';
import PollVoting from '../User/PollVoting';
import Leaderboard from '../User/Leaderboard';
import EmergencyAlert from '../User/EmergencyAlert';

const API_URL = 'http://localhost:5000/api';

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [resources, setResources] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRes, amenRes, bookRes, compRes, annRes] = await Promise.all([
        fetch(`${API_URL}/resources`),
        fetch(`${API_URL}/amenities`),
        fetch(`${API_URL}/bookings`),
        fetch(`${API_URL}/complaints`),
        fetch(`${API_URL}/announcements`)
      ]);

      setResources(await resRes.json());
      setAmenities(await amenRes.json());
      
      // Filter bookings to show only current user's bookings
      const allBookings = await bookRes.json();
      const userBookings = allBookings.filter(booking => {
        const bookingUserId = booking.user?._id || booking.user;
        return bookingUserId === user.id;
      });
      setBookings(userBookings);
      
      // Filter complaints to show only current user's complaints
      const allComplaints = await compRes.json();
      const userComplaints = allComplaints.filter(complaint => {
        const complaintUserId = complaint.reportedBy?._id || complaint.reportedBy;
        return complaintUserId === user.id;
      });
      setComplaints(userComplaints);
      
      setAnnouncements(await annRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const tabs = user?.role === 'admin' 
    ? ['overview', 'amenities', 'resources', 'announcements', 'book', 'complaints']
    : ['overview', 'book', 'complaints'];

  return (
    <div className="dashboard">
      <div className="container">
        <h1 style={{ color: 'white', marginBottom: '1rem' }}>Dashboard</h1>
        
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          background: 'white',
          padding: '1rem',
          borderRadius: '12px'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              background: activeTab === 'overview' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
              color: activeTab === 'overview' ? 'white' : '#333'
            }}
          >
            📊 Overview
          </button>
          
          <button
            onClick={() => setActiveTab('book')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              background: activeTab === 'book' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
              color: activeTab === 'book' ? 'white' : '#333'
            }}
          >
            📅 Book Amenity
          </button>
          
          <button
            onClick={() => setActiveTab('complaints')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              background: activeTab === 'complaints' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
              color: activeTab === 'complaints' ? 'white' : '#333'
            }}
          >
            📝 Complaints
          </button>

          {user?.role === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('amenities')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: activeTab === 'amenities' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                  color: activeTab === 'amenities' ? 'white' : '#333'
                }}
              >
                🏢 Manage Amenities
              </button>
              
              <button
                onClick={() => setActiveTab('resources')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: activeTab === 'resources' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                  color: activeTab === 'resources' ? 'white' : '#333'
                }}
              >
                🤝 Manage Resources
              </button>
              
              <button
                onClick={() => setActiveTab('announcements')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: activeTab === 'announcements' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                  color: activeTab === 'announcements' ? 'white' : '#333'
                }}
              >
                📢 Manage Announcements
              </button>
              
              <button
                onClick={() => setActiveTab('polls')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: activeTab === 'polls' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                  color: activeTab === 'polls' ? 'white' : '#333'
                }}
              >
                📊 Manage Polls
              </button>
              
              <button
                onClick={() => setActiveTab('alertManagement')}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: activeTab === 'alertManagement' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                  color: activeTab === 'alertManagement' ? 'white' : '#333'
                }}
              >
                🚨 Alert Management
              </button>
            </>
          )}
          
          <button
            onClick={() => setActiveTab('chatbot')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              background: activeTab === 'chatbot' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
              color: activeTab === 'chatbot' ? 'white' : '#333'
            }}
          >
            🤖 Chatbot
          </button>
          
          <button
            onClick={() => setActiveTab('pollVoting')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              background: activeTab === 'pollVoting' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
              color: activeTab === 'pollVoting' ? 'white' : '#333'
            }}
          >
            📊 Polls
          </button>
          
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              background: activeTab === 'leaderboard' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
              color: activeTab === 'leaderboard' ? 'white' : '#333'
            }}
          >
            🏆 Leaderboard
          </button>
          
          <button
            onClick={() => setActiveTab('emergencyAlert')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              background: activeTab === 'emergencyAlert' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
              color: activeTab === 'emergencyAlert' ? 'white' : '#333'
            }}
          >
            🚨 Emergency Alert
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
          {/* Announcements */}
          <div className="card">
            <h2>📢 Announcements</h2>
            {announcements.length > 0 ? (
              <ul className="card-list">
                {announcements.slice(0, 5).map((ann) => (
                  <li key={ann._id}>
                    <h4>{ann.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      {ann.content.substring(0, 100)}...
                    </p>
                    <span className={`badge badge-${ann.priority === 'high' ? 'danger' : 'info'}`}>
                      {ann.type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#999' }}>No announcements yet</p>
            )}
          </div>

          {/* Resources */}
          <div className="card">
            <h2>🤝 Available Resources</h2>
            {resources.length > 0 ? (
              <ul className="card-list">
                {resources.slice(0, 5).map((res) => (
                  <li key={res._id}>
                    <h4>{res.name}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>{res.category}</p>
                    <span className={`badge badge-${res.status === 'available' ? 'success' : 'warning'}`}>
                      {res.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#999' }}>No resources shared yet</p>
            )}
          </div>

          {/* Amenities */}
          <div className="card">
            <h2>📅 Book Amenities</h2>
            {amenities.length > 0 ? (
              <ul className="card-list">
                {amenities.map((amenity) => (
                  <li key={amenity._id}>
                    <h4>{amenity.name}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      {amenity.type} - ${amenity.pricePerHour}/hr
                    </p>
                    <span className="badge badge-info">{amenity.capacity} capacity</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#999' }}>No amenities available</p>
            )}
          </div>

          {/* My Bookings */}
          <div className="card">
            <h2>🎫 My Bookings</h2>
            {bookings.length > 0 ? (
              <ul className="card-list">
                {bookings.slice(0, 5).map((booking) => (
                  <li key={booking._id}>
                    <h4>{booking.amenity?.name || 'Amenity'}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                    <span className={`badge badge-${
                      booking.status === 'confirmed' ? 'success' : 
                      booking.status === 'pending' ? 'warning' : 'info'
                    }`}>
                      {booking.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#999' }}>No bookings yet</p>
            )}
          </div>

          {/* Complaints */}
          <div className="card">
            <h2>📝 Complaints</h2>
            {complaints.length > 0 ? (
              <ul className="card-list">
                {complaints.slice(0, 5).map((complaint) => (
                  <li key={complaint._id}>
                    <h4>{complaint.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>{complaint.category}</p>
                    <span className={`badge badge-${
                      complaint.status === 'resolved' ? 'success' :
                      complaint.status === 'in-progress' ? 'warning' : 'danger'
                    }`}>
                      {complaint.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#999' }}>No complaints filed</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h2>📊 Quick Stats</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', color: '#667eea', margin: 0 }}>{resources.length}</h3>
                <p style={{ color: '#666', margin: 0 }}>Total Resources</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', color: '#764ba2', margin: 0 }}>{bookings.length}</h3>
                <p style={{ color: '#666', margin: 0 }}>Total Bookings</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', color: '#f39c12', margin: 0 }}>{complaints.length}</h3>
                <p style={{ color: '#666', margin: 0 }}>Total Complaints</p>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'amenities' && user?.role === 'admin' && (
          <AmenityManagement user={user} />
        )}

        {activeTab === 'resources' && user?.role === 'admin' && (
          <ResourceManagement user={user} />
        )}

        {activeTab === 'announcements' && user?.role === 'admin' && (
          <AnnouncementManagement user={user} />
        )}

        {activeTab === 'polls' && user?.role === 'admin' && (
          <PollManagement user={user} />
        )}

        {activeTab === 'alertManagement' && user?.role === 'admin' && (
          <AlertManagement user={user} />
        )}

        {activeTab === 'book' && (
          <BookAmenity user={user} />
        )}

        {activeTab === 'complaints' && (
          <FileComplaint user={user} />
        )}

        {activeTab === 'chatbot' && (
          <Chatbot user={user} />
        )}

        {activeTab === 'pollVoting' && (
          <PollVoting user={user} />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard user={user} />
        )}

        {activeTab === 'emergencyAlert' && (
          <EmergencyAlert user={user} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
