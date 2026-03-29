// Clone System

class CloneSystem {
  constructor(projectManager) {
    this.projectManager = projectManager;
  }

  cloneProject(projectId, newOwner) {
    const original = this.projectManager.getProjectById(projectId);

    if (!original) {
      throw new Error("Project not found");
    }

    const newProject = this.projectManager.createProject(
      original.name + " (Clone)",
      newOwner,
      original.type
    );

    // نسخ الأعضاء
    newProject.members = [...original.members];

    return newProject;
  }
}

module.exports = CloneSystem;
