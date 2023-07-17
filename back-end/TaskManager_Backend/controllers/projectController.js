const projectModel = require("../models/projectModel");

async function getAllProjects() {
  try {
    const result = await projectModel.find({});
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error1 occurred while retrieving projects");
  }
}

async function addProject(project) {
  try {
    console.log(project);
    const newProject = new projectModel(project);
    const result = await newProject.save();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while adding a project");
  }
}

module.exports = { getAllProjects, addProject };
