const Alert = require('../models/Alert');

exports.createAlert = async (req, res, sendJSON) => {
  try {
    const { type, severity, location, description, isPanic } = req.body;
    const userId = req.user.id;
    
    const alert = new Alert({
      type,
      severity: isPanic ? 'critical' : severity,
      location,
      description,
      reportedBy: userId,
      isPanic: isPanic || false
    });
    
    await alert.save();
    await alert.populate('reportedBy', 'name email phone');
    
    sendJSON(res, 201, {
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to create alert'
    });
  }
};

exports.getAllAlerts = async (req, res, sendJSON) => {
  try {
    const { status, severity } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (severity) query.severity = severity;
    
    const alerts = await Alert.find(query)
      .populate('reportedBy', 'name email phone')
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });
    
    sendJSON(res, 200, {
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get alerts'
    });
  }
};

exports.getUserAlerts = async (req, res, sendJSON) => {
  try {
    const userId = req.user.id;
    
    const alerts = await Alert.find({ reportedBy: userId })
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 });
    
    sendJSON(res, 200, {
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get user alerts error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get alerts'
    });
  }
};

exports.getAlertById = async (req, res, sendJSON) => {
  try {
    const { id } = req.params;
    
    const alert = await Alert.findById(id)
      .populate('reportedBy', 'name email phone')
      .populate('acknowledgedBy', 'name')
      .populate('resolvedBy', 'name');
    
    if (!alert) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Alert not found'
      });
    }
    
    sendJSON(res, 200, {
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Get alert error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get alert'
    });
  }
};

exports.acknowledgeAlert = async (req, res, sendJSON) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const alert = await Alert.findById(id);
    
    if (!alert) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Alert not found'
      });
    }
    
    if (alert.status !== 'active') {
      return sendJSON(res, 400, {
        success: false,
        message: 'Alert is not active'
      });
    }
    
    alert.status = 'acknowledged';
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();
    
    await alert.save();
    await alert.populate('reportedBy acknowledgedBy', 'name');
    
    sendJSON(res, 200, {
      success: true,
      message: 'Alert acknowledged',
      data: alert
    });
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to acknowledge alert'
    });
  }
};

exports.resolveAlert = async (req, res, sendJSON) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const userId = req.user.id;
    
    const alert = await Alert.findById(id);
    
    if (!alert) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Alert not found'
      });
    }
    
    alert.status = 'resolved';
    alert.resolvedBy = userId;
    alert.resolvedAt = new Date();
    alert.resolution = resolution;
    
    await alert.save();
    await alert.populate('reportedBy acknowledgedBy resolvedBy', 'name');
    
    sendJSON(res, 200, {
      success: true,
      message: 'Alert resolved',
      data: alert
    });
  } catch (error) {
    console.error('Resolve alert error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to resolve alert'
    });
  }
};

exports.markFalseAlarm = async (req, res, sendJSON) => {
  try {
    const { id } = req.params;
    
    const alert = await Alert.findById(id);
    
    if (!alert) {
      return sendJSON(res, 404, {
        success: false,
        message: 'Alert not found'
      });
    }
    
    alert.status = 'false_alarm';
    
    await alert.save();
    
    sendJSON(res, 200, {
      success: true,
      message: 'Marked as false alarm',
      data: alert
    });
  } catch (error) {
    console.error('Mark false alarm error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to mark as false alarm'
    });
  }
};

exports.getAlertStats = async (req, res, sendJSON) => {
  try {
    const stats = {
      total: await Alert.countDocuments(),
      active: await Alert.countDocuments({ status: 'active' }),
      acknowledged: await Alert.countDocuments({ status: 'acknowledged' }),
      resolved: await Alert.countDocuments({ status: 'resolved' }),
      critical: await Alert.countDocuments({ severity: 'critical' }),
      panic: await Alert.countDocuments({ isPanic: true })
    };
    
    sendJSON(res, 200, {
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get alert stats error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get stats'
    });
  }
};
