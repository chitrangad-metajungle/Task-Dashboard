const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project: { type: String, required: false },
});

const projectModel = mongoose.model("project", projectSchema);

module.exports = projectModel;
