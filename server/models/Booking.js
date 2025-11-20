const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  amenity: { type: mongoose.Schema.Types.ObjectId, ref: 'Amenity', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  totalAmount: { type: Number, default: 0 },
  purpose: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
