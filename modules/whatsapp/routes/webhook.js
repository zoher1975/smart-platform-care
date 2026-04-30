const express = require("express");
const router = express.Router();

// ===============================
// ✅ Verification (Meta Webhook)
// ===============================
router.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook Verified");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Verification Failed");
    return res.sendStatus(403);
  }
});

// ===============================
// ✅ Incoming Messages
// ===============================
router.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    console.log("📩 Incoming WhatsApp:", JSON.stringify(data, null, 2));

    // استخراج الرسالة (هيكل Meta الرسمي)
    const message =
      data?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body;

      console.log("👤 From:", from);
      console.log("💬 Message:", text);

      // 🔥 هنا تقدر تربط AI أو رد تلقائي
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
