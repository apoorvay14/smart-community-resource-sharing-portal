const Forum = require('../models/Forum');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Forum.find({ isActive: true }).populate('author', 'name').sort('-createdAt');
    sendJSON(res, 200, discussions);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching discussions', error: error.message });
  }
};

exports.createDiscussion = async (req, res, body) => {
  try {
    const discussion = new Forum(body);
    await discussion.save();
    sendJSON(res, 201, { message: 'Discussion created successfully', discussion });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error creating discussion', error: error.message });
  }
};
