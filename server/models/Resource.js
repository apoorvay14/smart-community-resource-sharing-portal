const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Tools', 'Electronics', 'Books', 'Sports', 'Kitchen', 'Other'],
    required: true
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['available', 'borrowed', 'maintenance'],
    default: 'available'
  },
  currentBorrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  condition: {
    type: String,
    enum: ['new', 'good', 'fair', 'poor'],
    default: 'good'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
