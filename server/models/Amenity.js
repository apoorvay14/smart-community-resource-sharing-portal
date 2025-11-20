const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['Gym', 'Pool', 'Party Hall', 'Garden', 'Parking', 'Other'],
    required: true
  },
  capacity: { type: Number, default: 1 },
  pricePerHour: { type: Number, default: 0 },
  availableFrom: { type: String, default: '06:00' },
  availableTo: { type: String, default: '22:00' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Amenity', amenitySchema);
