require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

// Core systems
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

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ===============================
// Database
// ===============================
connectDB();

// ===============================
// Core System
// ===============================
const manager = new ProjectManager();
const cloneSystemInstance = new CloneSystem(manager);

// ===============================
// WhatsApp Module
// ===============================
app.use("/api/whatsapp", whatsappWebhook);

// ===============================
// Store System
// ===============================
app.use("/api/stores", storeRoutes);

// ===============================
// Project Management Routes
// ===============================
app.post("/create-project", (req, res) => {
  try {
    const { name, owner, type } = req.body;

    if (!name || !owner || !type) {
      return res.status(400).json({
        error: "name, owner, and type are required",
      });
    }

    const project = manager.createProject(name, owner, type);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/add-member", (req, res) => {
  try {
    const { projectId, member } = req.body;

    if (!projectId || !member) {
      return res.status(400).json({
        error: "projectId and member are required",
      });
    }

    manager.addMember(projectId, member);
    res.json({ message: "Member added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/clone-project", (req, res) => {
  try {
    const { projectId, newOwner } = req.body;

    if (!projectId || !newOwner) {
      return res.status(400).json({
        error: "projectId and newOwner are required",
      });
    }

    const cloned = cloneSystemInstance.cloneProject(projectId, newOwner);
    res.json(cloned);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.send("Smart Platform Care Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "smart-platform-care",
    timestamp: new Date().toISOString(),
  });
});

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ===============================
// Server
// ===============================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
