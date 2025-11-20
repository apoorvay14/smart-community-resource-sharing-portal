const Resource = require('../models/Resource');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('owner', 'name flatNumber').populate('currentBorrower', 'name');
    sendJSON(res, 200, resources);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching resources', error: error.message });
  }
};

exports.createResource = async (req, res, body) => {
  try {
    const resource = new Resource(body);
    await resource.save();
    sendJSON(res, 201, { message: 'Resource created successfully', resource });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error creating resource', error: error.message });
  }
};

exports.updateResource = async (req, res, id, body) => {
  try {
    const resource = await Resource.findByIdAndUpdate(id, body, { new: true });
    if (!resource) {
      return sendJSON(res, 404, { message: 'Resource not found' });
    }
    sendJSON(res, 200, { message: 'Resource updated successfully', resource });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error updating resource', error: error.message });
  }
};

exports.deleteResource = async (req, res, id) => {
  try {
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      return sendJSON(res, 404, { message: 'Resource not found' });
    }
    sendJSON(res, 200, { message: 'Resource deleted successfully' });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error deleting resource', error: error.message });
  }
};
