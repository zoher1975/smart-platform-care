const ProjectManager = require('./core/projects-system');
const CloneSystem = require('./core/clone-system');

// إنشاء مدير المشاريع
const manager = new ProjectManager();

// إنشاء مشروع
const project1 = manager.createProject("My First Project", "Zoher", "general");

// إضافة أعضاء
manager.addMember(project1.id, "Ali");
manager.addMember(project1.id, "Sara");

console.log("Original Project:");
console.log(project1);

// إنشاء نظام النسخ
const cloneSystem = new CloneSystem(manager);

// عمل clone
const cloned = cloneSystem.cloneProject(project1.id, "Mohamed");

console.log("\nCloned Project:");
console.log(cloned);
