import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const Leaderboard = ({ user }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [leaderboardRes, statsRes, activitiesRes] = await Promise.all([
        fetch(`${API_URL}/gamification/leaderboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/gamification/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/gamification/activities`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const leaderboardData = await leaderboardRes.json();
      const statsData = await statsRes.json();
      const activitiesData = await activitiesRes.json();

      if (leaderboardData.success) setLeaderboard(leaderboardData.data);
      if (statsData.success) setUserStats(statsData.data);
      if (activitiesData.success) setActivities(activitiesData.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      Diamond: '#b9f2ff',
      Platinum: '#e5e4e2',
      Gold: '#ffd700',
      Silver: '#c0c0c0',
      Bronze: '#cd7f32'
    };
    return colors[rank] || '#ccc';
  };

  const getRankIcon = (rank) => {
    const icons = {
      Diamond: '💎',
      Platinum: '🏆',
      Gold: '🥇',
      Silver: '🥈',
      Bronze: '🥉'
    };
    return icons[rank] || '🏅';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="leaderboard-page">
      <h2>🏆 Community Leaderboard</h2>
      <p className="subtitle">Top contributors and your achievements</p>

      {userStats && (
        <div className="user-stats-card">
          <h3>Your Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon" style={{ background: getRankColor(userStats.rank) }}>
                {getRankIcon(userStats.rank)}
              </div>
              <div className="stat-details">
                <span className="stat-label">Rank</span>
                <span className="stat-value">{userStats.rank}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-details">
                <span className="stat-label">Points</span>
                <span className="stat-value">{userStats.points}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <span className="stat-label">Level</span>
                <span className="stat-value">{userStats.level}</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎖️</div>
              <div className="stat-details">
                <span className="stat-label">Badges</span>
                <span className="stat-value">{userStats.badges.length}</span>
              </div>
            </div>
          </div>

          {userStats.badges.length > 0 && (
            <div className="badges-section">
              <h4>Your Badges</h4>
              <div className="badges-grid">
                {userStats.badges.map((badge, index) => (
                  <div key={index} className="badge-item">
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.name}</span>
                    <span className="badge-desc">{badge.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="leaderboard-section">
        <h3>Top Contributors</h3>
        <div className="leaderboard-table">
          {leaderboard.map((entry) => (
            <div key={entry.position} className={`leaderboard-row ${entry.user._id === user.id ? 'current-user' : ''}`}>
              <div className="position">
                {entry.position <= 3 ? (
                  <span className="medal">{['🥇', '🥈', '🥉'][entry.position - 1]}</span>
                ) : (
                  <span className="rank-number">#{entry.position}</span>
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{entry.user.name}</span>
                <span className="user-rank">{getRankIcon(entry.rank)} {entry.rank}</span>
              </div>
              <div className="user-points">
                <span className="points">{entry.points} pts</span>
                <span className="badges-count">🎖️ {entry.badges} badges</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="activities-section">
        <h3>Recent Activities</h3>
        {activities.length === 0 ? (
          <p>No activities yet. Start participating to earn points!</p>
        ) : (
          <div className="activities-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'resource_shared' && '🔄'}
                  {activity.type === 'complaint_resolved' && '✅'}
                  {activity.type === 'forum_post' && '💬'}
                  {activity.type === 'amenity_booking' && '📅'}
                  {activity.type === 'poll_vote' && '📊'}
                  {activity.type === 'helpful_answer' && '💡'}
                </div>
                <div className="activity-details">
                  <span className="activity-type">{activity.type.replace('_', ' ')}</span>
                  {activity.description && <span className="activity-desc">{activity.description}</span>}
                  <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                </div>
                <div className="activity-points">
                  +{activity.points} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="points-guide">
        <h3>How to Earn Points</h3>
        <div className="guide-grid">
          <div className="guide-item">
            <span>🔄 Share a resource</span>
            <span className="guide-points">+10 pts</span>
          </div>
          <div className="guide-item">
            <span>✅ Resolve a complaint</span>
            <span className="guide-points">+15 pts</span>
          </div>
          <div className="guide-item">
            <span>💬 Post in forum</span>
            <span className="guide-points">+5 pts</span>
          </div>
          <div className="guide-item">
            <span>📅 Book amenity</span>
            <span className="guide-points">+3 pts</span>
          </div>
          <div className="guide-item">
            <span>📊 Vote in poll</span>
            <span className="guide-points">+2 pts</span>
          </div>
          <div className="guide-item">
            <span>💡 Helpful answer</span>
            <span className="guide-points">+20 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
