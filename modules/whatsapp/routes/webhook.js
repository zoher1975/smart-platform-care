const express = require("express");

const router = express.Router();

// ===============================
// WhatsApp Webhook Verification
// Meta/Facebook uses this GET route
// ===============================
router.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (!VERIFY_TOKEN) {
    console.error("❌ WHATSAPP_VERIFY_TOKEN is missing in .env");
    return res.sendStatus(500);
  }

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp Webhook Verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ WhatsApp Webhook Verification Failed");
  return res.sendStatus(403);
});

// ===============================
// WhatsApp Incoming Messages
// Meta/Facebook sends messages here
// ===============================
router.post("/webhook", async (req, res) => {
  try {
    // Important: respond to Meta quickly
    res.sendStatus(200);

    const body = req.body;

    console.log("📩 Incoming WhatsApp Payload:");
    console.log(JSON.stringify(body, null, 2));

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) {
      console.log("ℹ️ No user message found in payload");
      return;
    }

    const from = message.from;
    const messageId = message.id;
    const messageType = message.type;

    let text = "";

    if (messageType === "text") {
      text = message.text?.body || "";
    }

    console.log("👤 From:", from);
    console.log("🆔 Message ID:", messageId);
    console.log("📌 Type:", messageType);
    console.log("💬 Text:", text);

    // TODO:
    // 1. Save message to database
    // 2. Send message to AI Router
    // 3. Send reply back through WhatsApp Cloud API
  } catch (error) {
    console.error("❌ WhatsApp Webhook Error:", error);
  }
});

module.exports = router;
