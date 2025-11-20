const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
};

exports.register = async (req, res, body) => {
  try {
    const { name, email, password, role, flatNumber, phone } = body;

    if (!name || !email || !password) {
      return sendJSON(res, 400, { message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendJSON(res, 400, { message: 'User already exists' });
    }

    const user = new User({ name, email, password, role, flatNumber, phone });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    sendJSON(res, 201, {
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    sendJSON(res, 500, { message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res, body) => {
  try {
    const { email, password } = body;

    if (!email || !password) {
      return sendJSON(res, 400, { message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendJSON(res, 401, { message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendJSON(res, 401, { message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    sendJSON(res, 200, {
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, flatNumber: user.flatNumber }
    });
  } catch (error) {
    sendJSON(res, 500, { message: 'Login failed', error: error.message });
  }
};
