const ChatMessage = require('../models/ChatMessage');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');

// AI Response Logic - Rule-based chatbot
const generateResponse = async (message, userId) => {
  const lowerMessage = message.toLowerCase();
  
  // FAQ Responses
  if (lowerMessage.includes('amenity') || lowerMessage.includes('book') || lowerMessage.includes('facilities')) {
    return {
      response: "🏢 **Amenity Booking Help:**\n\n1. Go to 'Book Amenity' tab\n2. Select the amenity you want to book\n3. Choose date and time\n4. Enter duration and purpose\n5. Submit your booking\n\nAvailable amenities: Gym, Swimming Pool, Party Hall, Garden, Parking, and more!",
      category: 'booking'
    };
  }
  
  if (lowerMessage.includes('complaint') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
    // Check complaint status
    const complaints = await Complaint.find({ reportedBy: userId }).sort({ createdAt: -1 }).limit(3);
    if (complaints.length > 0) {
      const complaintList = complaints.map((c, i) => 
        `${i + 1}. ${c.category} - Status: ${c.status} (${c.createdAt.toLocaleDateString()})`
      ).join('\n');
      return {
        response: `🔧 **Your Recent Complaints:**\n\n${complaintList}\n\nTo file a new complaint, go to 'File Complaint' tab.`,
        category: 'complaint'
      };
    }
    return {
      response: "🔧 **Complaint Help:**\n\nTo file a complaint:\n1. Go to 'File Complaint' tab\n2. Select category (Maintenance, Cleanliness, Security, etc.)\n3. Set priority level\n4. Describe the issue\n5. Add location details\n6. Submit\n\nYou'll receive updates as your complaint is processed!",
      category: 'complaint'
    };
  }
  
  if (lowerMessage.includes('guideline') || lowerMessage.includes('rule') || lowerMessage.includes('policy')) {
    return {
      response: "📋 **Community Guidelines:**\n\n1. **Respect Privacy** - Don't disturb neighbors during quiet hours (10 PM - 7 AM)\n2. **Common Area Usage** - Keep shared spaces clean\n3. **Parking** - Park only in designated spots\n4. **Pets** - Keep pets on leash in common areas\n5. **Noise** - Maintain reasonable noise levels\n6. **Amenity Booking** - Cancel bookings if plans change\n7. **Resource Sharing** - Return borrowed items on time\n\nFor detailed policies, contact administration.",
      category: 'guidelines'
    };
  }
  
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('cost')) {
    return {
      response: "💳 **Payment Information:**\n\nAmenity booking charges are calculated automatically based on:\n- Hourly rate of the amenity\n- Duration of booking\n\nTotal = Hourly Rate × Number of Hours\n\nPayment can be made online or at the community office. For maintenance fees and other payments, contact administration.",
      category: 'faq'
    };
  }
  
  if (lowerMessage.includes('resource') || lowerMessage.includes('borrow') || lowerMessage.includes('share')) {
    return {
      response: "🔄 **Resource Sharing:**\n\nOur community has shared resources like:\n- Tools (drill, hammer, ladder)\n- Electronics (projector, speakers)\n- Books & magazines\n- Sports equipment\n- Kitchen appliances\n\nCheck the 'Resources' section to see available items. Remember to return items in good condition!",
      category: 'faq'
    };
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('help')) {
    return {
      response: "🚨 **Emergency Assistance:**\n\nFor emergencies:\n1. Use the 'Emergency Alert' feature for immediate assistance\n2. Security: Available 24/7 at main gate\n3. Fire: Call 101 and alert security\n4. Medical: Call 108 (Ambulance)\n5. Police: Call 100\n\nFor urgent maintenance, file a high-priority complaint.",
      category: 'faq'
    };
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      response: "👋 Hello! I'm your community assistant. I can help you with:\n\n• Amenity booking\n• Complaint status\n• Community guidelines\n• Resource sharing\n• General FAQs\n\nWhat would you like to know?",
      category: 'general'
    };
  }
  
  // Default response
  return {
    response: "I'm here to help! Ask me about:\n\n• 📅 Amenity booking\n• 🔧 Filing complaints\n• 📋 Community guidelines\n• 🔄 Resource sharing\n• 💳 Payments & fees\n• 🚨 Emergency procedures\n\nJust type your question!",
    category: 'general'
  };
};

exports.sendMessage = async (req, res, sendJSON) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    
    const { response, category } = await generateResponse(message, userId);
    
    const chatMessage = new ChatMessage({
      user: userId,
      message,
      response,
      category
    });
    
    await chatMessage.save();
    
    sendJSON(res, 201, {
      success: true,
      data: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to send message'
    });
  }
};

exports.getChatHistory = async (req, res, sendJSON) => {
  try {
    const userId = req.user.id;
    
    const messages = await ChatMessage.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    sendJSON(res, 200, {
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to get chat history'
    });
  }
};

exports.clearHistory = async (req, res, sendJSON) => {
  try {
    const userId = req.user.id;
    
    await ChatMessage.deleteMany({ user: userId });
    
    sendJSON(res, 200, {
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    console.error('Clear history error:', error);
    sendJSON(res, 500, {
      success: false,
      message: 'Failed to clear history'
    });
  }
};
