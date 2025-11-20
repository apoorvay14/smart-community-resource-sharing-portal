const Announcement = require('../models/Announcement');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).populate('postedBy', 'name').sort('-createdAt');
    sendJSON(res, 200, announcements);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching announcements', error: error.message });
  }
};

exports.createAnnouncement = async (req, res, body) => {
  try {
    const announcement = new Announcement(body);
    await announcement.save();
    sendJSON(res, 201, { message: 'Announcement created successfully', announcement });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error creating announcement', error: error.message });
  }
};
