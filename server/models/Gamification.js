const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    icon: {
      type: String
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  activities: [{
    type: {
      type: String,
      enum: ['resource_shared', 'complaint_resolved', 'forum_post', 'amenity_booking', 'poll_vote', 'helpful_answer'],
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  rank: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Bronze'
  },
  level: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gamification', gamificationSchema);
