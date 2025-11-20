const Complaint = require('../models/Complaint');

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('reportedBy', 'name flatNumber').populate('assignedTo', 'name');
    sendJSON(res, 200, complaints);
  } catch (error) {
    sendJSON(res, 500, { message: 'Error fetching complaints', error: error.message });
  }
};

exports.createComplaint = async (req, res, body) => {
  try {
    const complaint = new Complaint(body);
    await complaint.save();
    sendJSON(res, 201, { message: 'Complaint created successfully', complaint });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error creating complaint', error: error.message });
  }
};

exports.updateComplaint = async (req, res, id, body) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(id, body, { new: true });
    if (!complaint) {
      return sendJSON(res, 404, { message: 'Complaint not found' });
    }
    sendJSON(res, 200, { message: 'Complaint updated successfully', complaint });
  } catch (error) {
    sendJSON(res, 500, { message: 'Error updating complaint', error: error.message });
  }
};
