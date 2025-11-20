const User = require('../models/User');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    sendJSON(res, 200, users);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching users', error: error.message });
  }
};

exports.getUserById = async (req, res, id) => {
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return sendJSON(res, 404, { message: 'User not found' });
    }
    sendJSON(res, 200, user);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching user', error: error.message });
  }
};

exports.updateUser = async (req, res, id, body) => {
  try {
    const user = await User.findByIdAndUpdate(id, body, { new: true }).select('-password');
    if (!user) {
      return sendJSON(res, 404, { message: 'User not found' });
    }
    sendJSON(res, 200, { message: 'User updated successfully', user });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error updating user', error: error.message });
  }
};
