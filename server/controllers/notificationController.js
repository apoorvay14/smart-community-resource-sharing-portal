const Notification = require('../models/Notification');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort('-createdAt').limit(50);
    sendJSON(res, 200, notifications);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching notifications', error: error.message });
  }
};
