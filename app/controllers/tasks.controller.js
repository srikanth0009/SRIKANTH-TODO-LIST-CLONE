const db = require("../models/db");

const Project = require('../models/projects.model');
const Task = require('../models/tasks.model');

exports.create = async (req, res) => {
    try {
        const { content, project_Id, description, due_Date, is_completed, created_at } = req.body;

        const id = await Project.findById(project_Id);
        if (!id) {
            return res.status(400).send({ message: "The entered project name is invalid" });
        }

        const task = await Task.create({ content, project_Id, description, due_Date, is_completed, created_at });
        res.send(task);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const tasks = await Task.findAll(req);
        res.send(tasks);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findByProjectId = async (req, res) => {
    try {
        const project_Id = req.params.project_Id;

        const tasks = await Task.findByProjectId(project_Id);
        if (tasks.length === 0) {
            return res.status(404).send({ message: "No tasks found for the given project id" });
        }
        res.send(tasks);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTask = await Task.update(id, req.body);
        res.send(updatedTask);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.delete(id);
        res.send({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Task.deleteAll();
        res.send({ message: "All tasks deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
