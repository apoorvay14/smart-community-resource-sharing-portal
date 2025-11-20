const Booking = require('../models/Booking');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('amenity', 'name type').populate('user', 'name flatNumber');
    sendJSON(res, 200, bookings);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching bookings', error: error.message });
  }
};

exports.createBooking = async (req, res, body) => {
  try {
    const booking = new Booking(body);
    await booking.save();
    sendJSON(res, 201, { message: 'Booking created successfully', booking });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error creating booking', error: error.message });
  }
};
