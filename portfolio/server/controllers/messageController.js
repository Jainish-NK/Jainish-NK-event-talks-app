const Message = require("../models/Message");
const sendEmailNotification = require("../config/nodemailer");

// SUBMIT a message (Public)
exports.submitMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message body are required." });
  }

  try {
    const newMessage = await Message.create({ name, email, subject, message });
    
    // Asynchronously send email notification so it doesn't block response
    sendEmailNotification({ name, email, subject, message });

    res.status(201).json({ message: "Inquiry submitted successfully!", data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit inquiry.", error: error.message });
  }
};

// GET all messages (Protected Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages.", error: error.message });
  }
};

// MARK AS READ (Protected Admin)
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark message as read.", error: error.message });
  }
};

// DELETE a message (Protected Admin)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    res.json({ message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message.", error: error.message });
  }
};
