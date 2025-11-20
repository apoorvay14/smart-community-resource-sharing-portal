const Amenity = require('../models/Amenity');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

exports.getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find({ isActive: true });
    sendJSON(res, 200, amenities);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching amenities', error: error.message });
  }
};

exports.createAmenity = async (req, res, body) => {
  try {
    const amenity = new Amenity(body);
    await amenity.save();
    sendJSON(res, 201, { message: 'Amenity created successfully', amenity });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error creating amenity', error: error.message });
  }
};
