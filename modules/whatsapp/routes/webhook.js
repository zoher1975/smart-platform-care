const express = require("express");
const router = express.Router();

// ===============================
// Verification (Meta)
// ===============================
router.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (!VERIFY_TOKEN) {
    console.error("❌ Missing WHATSAPP_VERIFY_TOKEN");
    return res.sendStatus(500);
  }

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook Verified");
    return res.status(200).send(challenge);
  }

  console.log("❌ Verification Failed");
  return res.sendStatus(403);
});

// ===============================
// Incoming Messages
// ===============================
router.post("/webhook", async (req, res) => {
  try {
    // IMPORTANT: reply fast to Meta
    res.sendStatus(200);

    const body = req.body;
    if (body.object !== "whatsapp_business_account") {
  console.log("ℹ️ Ignored non-WhatsApp payload");
  return;
}
    console.log("📩 Payload:\n", JSON.stringify(body, null, 2));

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const message = value?.messages?.[0];
    if (!message) {
      console.log("ℹ️ No message in payload");
      return;
    }

    const from = message.from;
    const type = message.type;

    let text = "";
    if (type === "text") {
      text = message.text?.body || "";
    }

    console.log("👤 From:", from);
    console.log("📌 Type:", type);
    console.log("💬 Text:", text);

    // ===============================
    // TODO (الخطوة التالية):
    // 1) استدعاء AI Router:
    //    const reply = await askAI(text);
    // 2) إرسال الرد عبر WhatsApp API
    // ===============================

  } catch (err) {
    console.error("❌ Webhook Error:", err);
  }
});

module.exports = router;
