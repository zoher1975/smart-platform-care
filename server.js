require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

// الأكواد القديمة
const ProjectManager = require("./core/projects-system");
const CloneSystem = require("./core/clone-system");

// routes
const storeRoutes = require("./routes/stores");

const app = express();
app.use(express.json());
// 👇 هنا الإضافة
const whatsappWebhook = require("./modules/whatsapp/routes/webhook");
app.use("/api/whatsapp", whatsappWebhook);

// ===============================
// الاتصال بقاعدة البيانات
// ===============================
connectDB();

// ===============================
// النظام القديم
// ===============================
const manager = new ProjectManager();
const cloneSystemInstance = new CloneSystem(manager);

// إنشاء مشروع
app.post("/create-project", (req, res) => {
  const { name, owner, type } = req.body;
  const project = manager.createProject(name, owner, type);
  res.json(project);
});

// إضافة عضو
app.post("/add-member", (req, res) => {
  const { projectId, member } = req.body;
  manager.addMember(projectId, member);
  res.json({ message: "Member added" });
});

// نسخ مشروع
app.post("/clone-project", (req, res) => {
  const { projectId, newOwner } = req.body;

  try {
    const cloned = cloneSystemInstance.cloneProject(projectId, newOwner);
    res.json(cloned);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ===============================
// Store System
// ===============================
app.use("/api/stores", storeRoutes);

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send("Grthup Backend is running 🚀");
});

// تشغيل السيرفر
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
