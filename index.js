const ProjectManager = require('./core/projects-system');
const CloneSystem = require('./core/clone-system');

const manager = new ProjectManager();

const project1 = manager.createProject("My First Project", "Zoher", "general");

manager.addMember(project1.id, "Ali");
manager.addMember(project1.id, "Sara");

console.log("Original Project:");
console.log(project1);

const cloneSystem = new CloneSystem(manager);

const cloned = cloneSystem.cloneProject(project1.id, "Mohamed");

console.log("\nCloned Project:");
console.log(cloned);
