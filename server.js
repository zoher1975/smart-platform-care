const express = require('express');

const ProjectManager = require('./core/projects-system');
const CloneSystem = require('./core/clone-system');

const app = express();
app.use(express.json());

// إنشاء المدير
const manager = new ProjectManager();

// إنشاء نظام النسخ (اسم مختلف)
const cloneSystemInstance = new CloneSystem(manager);


// إنشاء مشروع
app.post('/create-project', (req, res) => {
    const { name, owner, type } = req.body;

    const project = manager.createProject(name, owner, type);

    res.json(project);
});


// إضافة عضو
app.post('/add-member', (req, res) => {
    const { projectId, member } = req.body;

    manager.addMember(projectId, member);

    res.json({ message: "Member added" });
});


// نسخ مشروع
app.post('/clone-project', (req, res) => {
    const { projectId, newOwner } = req.body;

    try {
        const cloned = cloneSystemInstance.cloneProject(projectId, newOwner);
        res.json(cloned);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});


// تشغيل السيرفر
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
