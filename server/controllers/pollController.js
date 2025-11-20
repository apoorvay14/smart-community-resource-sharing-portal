const Poll = require('../models/Poll');
const Gamification = require('../models/Gamification');

exports.createPoll = async (req, res, sendJSON) => {
  try {
    const { title, description, category, options, anonymous, endDate } = req.body;
    const userId = req.user.id;
    
    // Format options
    const formattedOptions = options.map(opt => ({
      text: opt,
      votes: 0
    }));
    
    const poll = new Poll({
      title,
      description,
      category,
      options: formattedOptions,
      anonymous,
      createdBy: userId,
      endDate: endDate ? new Date(endDate) : null
    });
    
    await poll.save();
    
    sendJSON(res, 201, {
      success: true,
      data: poll
    });
  } catch (error) {
    console.error('Create poll error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to create poll'
    });
  }
};

exports.getAllPolls = async (req, res, sendJSON) => {
  try {
    const polls = await Poll.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    sendJSON(res, 200, {
      success: true,
      data: polls
    });
  } catch (error) {
    console.error('Get polls error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get polls'
    });
  }
};

exports.getPollById = async (req, res, sendJSON) => {
  try {
    const { id } = req.params;
    
    const poll = await Poll.findById(id)
      .populate('createdBy', 'name email');
    
    if (!poll) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Poll not found'
      });
    }
    
    sendJSON(res, 200, {
      success: true,
      data: poll
    });
  } catch (error) {
    console.error('Get poll error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get poll'
    });
  }
};

exports.votePoll = async (req, res, sendJSON) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;
    const userId = req.user.id;
    
    const poll = await Poll.findById(id);
    
    if (!poll) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Poll not found'
      });
    }
    
    if (poll.status !== 'active') {
      return sendJSON(res, 400, {
        success: false,
        message: 'Poll is not active'
      });
    }
    
    // Check if user already voted
    const hasVoted = poll.votes.some(vote => vote.user.toString() === userId);
    if (hasVoted) {
      return sendJSON(res, 400, {
        success: false,
        message: 'You have already voted'
      });
    }
    
    // Add vote
    poll.votes.push({
      user: userId,
      option: optionIndex,
      isAnonymous: poll.anonymous
    });
    
    // Update option vote count
    poll.options[optionIndex].votes += 1;
    
    await poll.save();
    
    // Award points for voting
    try {
      let gamification = await Gamification.findOne({ user: userId });
      
      if (!gamification) {
        gamification = new Gamification({
          user: userId,
          points: 0,
          activities: [],
          badges: []
        });
      }
      
      // Add activity and points
      const pointsEarned = 2; // Points for poll vote
      gamification.activities.push({
        type: 'poll_vote',
        points: pointsEarned,
        description: `Voted in poll: ${poll.title}`
      });
      
      gamification.points += pointsEarned;
      
      // Update rank based on points
      if (gamification.points >= 500) {
        gamification.rank = 'Diamond';
      } else if (gamification.points >= 300) {
        gamification.rank = 'Platinum';
      } else if (gamification.points >= 150) {
        gamification.rank = 'Gold';
      } else if (gamification.points >= 50) {
        gamification.rank = 'Silver';
      } else {
        gamification.rank = 'Bronze';
      }
      
      // Update level
      gamification.level = Math.floor(gamification.points / 50) + 1;
      
      // Check for badges
      if (gamification.points >= 100 && !gamification.badges.some(b => b.name === 'Active Participant')) {
        gamification.badges.push({
          name: 'Active Participant',
          description: 'Earned 100 points',
          icon: '⭐'
        });
      }
      
      await gamification.save();
    } catch (gamificationError) {
      console.error('Failed to award points:', gamificationError);
      // Don't fail the vote if gamification fails
    }
    
    sendJSON(res, 200, {
      success: true,
      message: 'Vote recorded successfully',
      data: poll,
      pointsEarned: 2
    });
  } catch (error) {
    console.error('Vote poll error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to vote'
    });
  }
};

exports.closePoll = async (req, res, sendJSON) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const poll = await Poll.findById(id);
    
    if (!poll) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Poll not found'
      });
    }
    
    // Only creator or admin can close
    if (poll.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return sendJSON(res, 403, {
        success: false,
        message: 'Unauthorized'
      });
    }
    
    poll.status = 'closed';
    await poll.save();
    
    sendJSON(res, 200, {
      success: true,
      message: 'Poll closed successfully',
      data: poll
    });
  } catch (error) {
    console.error('Close poll error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to close poll'
    });
  }
};

exports.getPollAnalytics = async (req, res, sendJSON) => {
  try {
    const { id } = req.params;
    
    const poll = await Poll.findById(id)
      .populate('createdBy', 'name email')
      .populate('votes.user', 'name email');
    
    if (!poll) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Poll not found'
      });
    }
    
    const totalVotes = poll.votes.length;
    const analytics = {
      totalVotes,
      options: poll.options.map((opt, index) => ({
        text: opt.text,
        votes: opt.votes,
        percentage: totalVotes > 0 ? ((opt.votes / totalVotes) * 100).toFixed(2) : 0
      })),
      votingPattern: poll.votes.map(vote => ({
        user: poll.anonymous ? 'Anonymous' : (vote.user?.name || 'Unknown User'),
        option: poll.options[vote.option].text,
        votedAt: vote.votedAt
      }))
    };
    
    sendJSON(res, 200, {
      success: true,
      data: {
        poll,
        analytics
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get analytics'
    });
  }
};
