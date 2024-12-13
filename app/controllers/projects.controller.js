const Project = require('../models/projects.model');
const task = require("../models/tasks.model");


exports.create = async (req, res) => {

    const { project_name, color, is_favourite, user_id } = req.body;

    try {
        const data = Project.create({ project_name, color, is_favourite, user_id });
        res.send("project created");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findAll = async (req, res) => {

    try {
        const data = await Project.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findByUserId = async (req, res) => {

    const id = req.params.id;

    try {
        const data = await Project.findByUserId(id);

        if (!data) {
            res.status(404).send({ message: "Project not found" });
        }

        //  const tasks = await task.findByProjectId(id);
        //  const result = { ...data, tasks };
        res.send(data);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Project.update(id, req.body);
        res.send("updated successfully");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
         await Project.delete(id);
        res.send("Project deleted");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteAll = async (req, res) => {

    try {
        await Project.deleteAll();
        res.send("All Projects deleted");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

