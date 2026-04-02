require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// الأكواد القديمة (نحتفظ بها)
const ProjectManager = require("./core/projects-system");
const CloneSystem = require("./core/clone-system");

const app = express();
app.use(express.json());

// ===============================
// 🔹 نظام المشاريع (قديم)
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
// 🔥 النظام الجديد (Stores API)
// ===============================

// ربط routes
const storeRoutes = require("./routes/stores");
app.use("/api/stores", storeRoutes);

// ===============================
// 🔥 MongoDB
// ===============================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ===============================
// 🚀 تشغيل السيرفر
// ===============================

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
