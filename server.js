require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

// Core
const ProjectManager = require("./core/projects-system");
const CloneSystem = require("./core/clone-system");

// Routes
const storeRoutes = require("./routes/stores");
const whatsappWebhook = require("./modules/whatsapp/routes/webhook");

const app = express();

// ===============================
// Middlewares
// ===============================
app.use(express.json());

// Logger بسيط
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ===============================
// Routes
// ===============================

// WhatsApp
app.use("/api/whatsapp", whatsappWebhook);

// Stores
app.use("/api/stores", storeRoutes);

// ===============================
// Core System
// ===============================
const manager = new ProjectManager();
const cloneSystemInstance = new CloneSystem(manager);

// Create project
app.post("/create-project", (req, res) => {
  try {
    const { name, owner, type } = req.body;
    if (!name || !owner || !type) {
      return res.status(400).json({ error: "name, owner, type required" });
    }
    const project = manager.createProject(name, owner, type);
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add member
app.post("/add-member", (req, res) => {
  try {
    const { projectId, member } = req.body;
    if (!projectId || !member) {
      return res.status(400).json({ error: "projectId, member required" });
    }
    manager.addMember(projectId, member);
    res.json({ message: "Member added" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Clone project
app.post("/clone-project", (req, res) => {
  try {
    const { projectId, newOwner } = req.body;
    if (!projectId || !newOwner) {
      return res.status(400).json({ error: "projectId, newOwner required" });
    }
    const cloned = cloneSystemInstance.cloneProject(projectId, newOwner);
    res.json(cloned);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// Health
app.get("/", (req, res) => {
  res.send("Smart Platform Care Backend is running 🚀");
});
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// ===============================
// DB + Server
// ============const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});===================
connectDB();

