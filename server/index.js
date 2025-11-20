const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Import controllers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const resourceController = require('./controllers/resourceController');
const amenityController = require('./controllers/amenityController');
const bookingController = require('./controllers/bookingController');
const complaintController = require('./controllers/complaintController');
const announcementController = require('./controllers/announcementController');
const forumController = require('./controllers/forumController');
const notificationController = require('./controllers/notificationController');
const chatbotController = require('./controllers/chatbotController');
const pollController = require('./controllers/pollController');
const gamificationController = require('./controllers/gamificationController');
const alertController = require('./controllers/alertController');
const authenticateToken = require('./middleware/auth');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/communityDB';

// Helper function to parse JSON body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Helper function to send JSON response
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  try {
    // Health check
    if (pathname === '/api/health' && method === 'GET') {
      return sendJSON(res, 200, { status: 'OK', message: 'Server is running' });
    }

    // Auth routes
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      return authController.register(req, res, body);
    }
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      return authController.login(req, res, body);
    }

    // User routes
    if (pathname === '/api/users' && method === 'GET') {
      return userController.getAllUsers(req, res);
    }
    if (pathname.match(/^\/api\/users\/\w+$/) && method === 'GET') {
      const id = pathname.split('/')[3];
      return userController.getUserById(req, res, id);
    }
    if (pathname.match(/^\/api\/users\/\w+$/) && method === 'PUT') {
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      return userController.updateUser(req, res, id, body);
    }

    // Resource routes
    if (pathname === '/api/resources' && method === 'GET') {
      return resourceController.getAllResources(req, res);
    }
    if (pathname === '/api/resources' && method === 'POST') {
      const body = await parseBody(req);
      return resourceController.createResource(req, res, body);
    }
    if (pathname.match(/^\/api\/resources\/\w+$/) && method === 'PUT') {
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      return resourceController.updateResource(req, res, id, body);
    }
    if (pathname.match(/^\/api\/resources\/\w+$/) && method === 'DELETE') {
      const id = pathname.split('/')[3];
      return resourceController.deleteResource(req, res, id);
    }

    // Amenity routes
    if (pathname === '/api/amenities' && method === 'GET') {
      return amenityController.getAllAmenities(req, res);
    }
    if (pathname === '/api/amenities' && method === 'POST') {
      const body = await parseBody(req);
      return amenityController.createAmenity(req, res, body);
    }

    // Booking routes
    if (pathname === '/api/bookings' && method === 'GET') {
      return bookingController.getAllBookings(req, res);
    }
    if (pathname === '/api/bookings' && method === 'POST') {
      const body = await parseBody(req);
      return bookingController.createBooking(req, res, body);
    }

    // Complaint routes
    if (pathname === '/api/complaints' && method === 'GET') {
      return complaintController.getAllComplaints(req, res);
    }
    if (pathname === '/api/complaints' && method === 'POST') {
      const body = await parseBody(req);
      return complaintController.createComplaint(req, res, body);
    }
    if (pathname.match(/^\/api\/complaints\/\w+$/) && method === 'PUT') {
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      return complaintController.updateComplaint(req, res, id, body);
    }

    // Announcement routes
    if (pathname === '/api/announcements' && method === 'GET') {
      return announcementController.getAllAnnouncements(req, res);
    }
    if (pathname === '/api/announcements' && method === 'POST') {
      const body = await parseBody(req);
      return announcementController.createAnnouncement(req, res, body);
    }

    // Forum routes
    if (pathname === '/api/forum' && method === 'GET') {
      return forumController.getAllDiscussions(req, res);
    }
    if (pathname === '/api/forum' && method === 'POST') {
      const body = await parseBody(req);
      return forumController.createDiscussion(req, res, body);
    }

    // Notification routes
    if (pathname === '/api/notifications' && method === 'GET') {
      return notificationController.getAllNotifications(req, res);
    }

    // Chatbot routes
    if (pathname === '/api/chatbot/send' && method === 'POST') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const body = await parseBody(req);
      req.body = body;
      req.user = user;
      return chatbotController.sendMessage(req, res, sendJSON);
    }
    if (pathname === '/api/chatbot/history' && method === 'GET') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      req.user = user;
      return chatbotController.getChatHistory(req, res, sendJSON);
    }
    if (pathname === '/api/chatbot/clear' && method === 'DELETE') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      req.user = user;
      return chatbotController.clearHistory(req, res, sendJSON);
    }

    // Poll routes
    if (pathname === '/api/polls' && method === 'GET') {
      return pollController.getAllPolls(req, res, sendJSON);
    }
    if (pathname === '/api/polls' && method === 'POST') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const body = await parseBody(req);
      req.body = body;
      req.user = user;
      return pollController.createPoll(req, res, sendJSON);
    }
    if (pathname.match(/^\/api\/polls\/\w+$/) && method === 'GET') {
      const id = pathname.split('/')[3];
      req.params = { id };
      return pollController.getPollById(req, res, sendJSON);
    }
    if (pathname.match(/^\/api\/polls\/\w+\/vote$/) && method === 'POST') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      req.params = { id };
      req.body = body;
      req.user = user;
      return pollController.votePoll(req, res, sendJSON);
    }
    if (pathname.match(/^\/api\/polls\/\w+\/close$/) && method === 'PUT') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const id = pathname.split('/')[3];
      req.params = { id };
      req.user = user;
      return pollController.closePoll(req, res, sendJSON);
    }
    if (pathname.match(/^\/api\/polls\/\w+\/analytics$/) && method === 'GET') {
      const id = pathname.split('/')[3];
      req.params = { id };
      return pollController.getPollAnalytics(req, res, sendJSON);
    }

    // Gamification routes
    if (pathname === '/api/gamification/stats' && method === 'GET') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      req.user = user;
      return gamificationController.getUserStats(req, res, sendJSON);
    }
    if (pathname === '/api/gamification/leaderboard' && method === 'GET') {
      return gamificationController.getLeaderboard(req, res, sendJSON);
    }
    if (pathname === '/api/gamification/activities' && method === 'GET') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      req.user = user;
      return gamificationController.getActivities(req, res, sendJSON);
    }
    if (pathname === '/api/gamification/badges' && method === 'GET') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      req.user = user;
      return gamificationController.getBadges(req, res, sendJSON);
    }
    if (pathname === '/api/gamification/add-points' && method === 'POST') {
      const body = await parseBody(req);
      req.body = body;
      return gamificationController.addPoints(req, res, sendJSON);
    }

    // Alert routes
    if (pathname === '/api/alerts' && method === 'GET') {
      const query = parsedUrl.query;
      req.query = query;
      return alertController.getAllAlerts(req, res, sendJSON);
    }
    if (pathname === '/api/alerts' && method === 'POST') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const body = await parseBody(req);
      req.body = body;
      req.user = user;
      return alertController.createAlert(req, res, sendJSON);
    }
    if (pathname === '/api/alerts/my' && method === 'GET') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      req.user = user;
      return alertController.getUserAlerts(req, res, sendJSON);
    }
    if (pathname === '/api/alerts/stats' && method === 'GET') {
      return alertController.getAlertStats(req, res, sendJSON);
    }
    if (pathname.match(/^\/api\/alerts\/\w+$/) && method === 'GET') {
      const id = pathname.split('/')[3];
      req.params = { id };
      return alertController.getAlertById(req, res, sendJSON);
    }
    if (pathname.match(/^\/api\/alerts\/\w+\/acknowledge$/) && method === 'PUT') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const id = pathname.split('/')[3];
      req.params = { id };
      req.user = user;
      return alertController.acknowledgeAlert(req, res, sendJSON);
    }
    if (pathname.match(/^\/api\/alerts\/\w+\/resolve$/) && method === 'PUT') {
      const user = authenticateToken(req);
      if (!user) return sendJSON(res, 401, { message: 'Unauthorized' });
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      req.params = { id };
      req.body = body;
      req.user = user;
      return alertController.resolveAlert(req, res, sendJSON);
    }
    if (pathname.match(/^\/api\/alerts\/\w+\/false-alarm$/) && method === 'PUT') {
      const id = pathname.split('/')[3];
      req.params = { id };
      return alertController.markFalseAlarm(req, res, sendJSON);
    }

    // 404 Not Found
    sendJSON(res, 404, { message: 'Route not found' });
  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, 500, { message: 'Internal server error', error: error.message });
  }
});

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
