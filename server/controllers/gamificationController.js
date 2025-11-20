const Gamification = require('../models/Gamification');

// Point values for different activities
const POINT_VALUES = {
  resource_shared: 10,
  complaint_resolved: 15,
  forum_post: 5,
  amenity_booking: 3,
  poll_vote: 2,
  helpful_answer: 20
};

// Badge criteria
const BADGES = [
  { name: 'First Share', description: 'Shared your first resource', points: 10, icon: '🎁' },
  { name: 'Problem Solver', description: 'Resolved 5 complaints', points: 75, icon: '🔧' },
  { name: 'Active Participant', description: 'Earned 100 points', points: 100, icon: '⭐' },
  { name: 'Community Leader', description: 'Top contributor for a month', points: 200, icon: '👑' },
  { name: 'Super Helper', description: 'Helped 10 community members', points: 200, icon: '🦸' }
];

// Rank thresholds
const RANKS = [
  { name: 'Bronze', minPoints: 0 },
  { name: 'Silver', minPoints: 50 },
  { name: 'Gold', minPoints: 150 },
  { name: 'Platinum', minPoints: 300 },
  { name: 'Diamond', minPoints: 500 }
];

const calculateRank = (points) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].minPoints) {
      return RANKS[i].name;
    }
  }
  return 'Bronze';
};

const checkAndAwardBadges = async (gamification) => {
  const newBadges = [];
  
  // Check each badge criteria
  if (gamification.points >= 10 && !gamification.badges.some(b => b.name === 'First Share')) {
    newBadges.push({
      name: 'First Share',
      description: 'Shared your first resource',
      icon: '🎁'
    });
  }
  
  if (gamification.points >= 100 && !gamification.badges.some(b => b.name === 'Active Participant')) {
    newBadges.push({
      name: 'Active Participant',
      description: 'Earned 100 points',
      icon: '⭐'
    });
  }
  
  if (gamification.points >= 200 && !gamification.badges.some(b => b.name === 'Super Helper')) {
    newBadges.push({
      name: 'Super Helper',
      description: 'Helped community members',
      icon: '🦸'
    });
  }
  
  return newBadges;
};

exports.addPoints = async (req, res, sendJSON) => {
  try {
    const { userId, activityType, description } = req.body;
    
    const points = POINT_VALUES[activityType] || 0;
    
    let gamification = await Gamification.findOne({ user: userId });
    
    if (!gamification) {
      gamification = new Gamification({
        user: userId,
        points: 0,
        activities: [],
        badges: []
      });
    }
    
    // Add activity
    gamification.activities.push({
      type: activityType,
      points,
      description
    });
    
    // Update points
    gamification.points += points;
    
    // Update rank
    gamification.rank = calculateRank(gamification.points);
    
    // Update level
    gamification.level = Math.floor(gamification.points / 50) + 1;
    
    // Check and award badges
    const newBadges = await checkAndAwardBadges(gamification);
    if (newBadges.length > 0) {
      gamification.badges.push(...newBadges);
    }
    
    await gamification.save();
    
    sendJSON(res, 200, {
      success: true,
      data: gamification,
      newBadges
    });
  } catch (error) {
    console.error('Add points error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to add points'
    });
  }
};

exports.getUserStats = async (req, res, sendJSON) => {
  try {
    const userId = req.user.id;
    
    let gamification = await Gamification.findOne({ user: userId })
      .populate('user', 'name email');
    
    if (!gamification) {
      gamification = new Gamification({
        user: userId,
        points: 0,
        activities: [],
        badges: []
      });
      await gamification.save();
    }
    
    sendJSON(res, 200, {
      success: true,
      data: gamification
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get user stats'
    });
  }
};

exports.getLeaderboard = async (req, res, sendJSON) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await Gamification.find()
      .populate('user', 'name email')
      .sort({ points: -1 })
      .limit(limit);
    
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      position: index + 1,
      user: entry.user,
      points: entry.points,
      rank: entry.rank,
      level: entry.level,
      badges: entry.badges.length
    }));
    
    sendJSON(res, 200, {
      success: true,
      data: leaderboardWithRank
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get leaderboard'
    });
  }
};

exports.getActivities = async (req, res, sendJSON) => {
  try {
    const userId = req.user.id;
    
    const gamification = await Gamification.findOne({ user: userId });
    
    if (!gamification) {
      return sendJSON(res, 200, {
        success: true,
        data: []
      });
    }
    
    const recentActivities = gamification.activities
      .sort((a, b) => b.date - a.date)
      .slice(0, 20);
    
    sendJSON(res, 200, {
      success: true,
      data: recentActivities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get activities'
    });
  }
};

exports.getBadges = async (req, res, sendJSON) => {
  try {
    const userId = req.user.id;
    
    const gamification = await Gamification.findOne({ user: userId });
    
    if (!gamification) {
      return sendJSON(res, 200, {
        success: true,
        data: []
      });
    }
    
    sendJSON(res, 200, {
      success: true,
      data: gamification.badges
    });
  } catch (error) {
    console.error('Get badges error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get badges'
    });
  }
};
