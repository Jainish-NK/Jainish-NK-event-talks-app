const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// POST a new contact message (Public)
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message content are required." });
  }

  try {
    const newMessage = await db.Message.create({
      name,
      email,
      subject: subject || "No Subject",
      message,
    });
    
    // Console log notification
    console.log(`✉️ Received Message from ${name} (${email}): "${message.substring(0, 50)}..."`);
    
    res.status(201).json({ message: "Message sent successfully!", data: newMessage });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit message.", error: err.message });
  }
});

// GET all messages (Protected Admin)
router.get("/", auth, async (req, res) => {
  try {
    const messages = await db.Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve messages.", error: err.message });
  }
});

// DELETE a message (Protected Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await db.Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }
    res.json({ message: "Message deleted successfully.", message });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message.", error: err.message });
  }
});

module.exports = router;
