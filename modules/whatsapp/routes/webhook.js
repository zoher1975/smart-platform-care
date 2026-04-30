const express = require("express");

const router = express.Router();

// استقبال رسائل واتساب
router.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    console.log("📩 Incoming WhatsApp message:", data);

    // هنا لاحقًا سنرسلها إلى AI
    res.status(200).send("Received");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

module.exports = router;
