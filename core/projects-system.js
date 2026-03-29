// Simple Projects System (Core)

class Project {
  constructor(id, name, owner, type) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.type = type;
    this.members = [];
    this.createdAt = new Date();
  }
}

class ProjectManager {
  constructor() {
    this.projects = [];
  }

  createProject(name, owner, type = "general") {
    const id = Date.now().toString();
    const project = new Project(id, name, owner, type);
    this.projects.push(project);
    return project;
  }

  getProjects() {
    return this.projects;
  }

  getProjectById(id) {
    return this.projects.find(p => p.id === id);
  }

  addMember(projectId, user) {
    const project = this.getProjectById(projectId);
    if (project) {
      project.members.push(user);
    }
  }
}

module.exports = ProjectManager;
