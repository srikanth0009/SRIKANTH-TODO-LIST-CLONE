const Comment = require('../models/comments.model');
const Project = require('../models/projects.model');
const Task = require('../models/tasks.model');


exports.create = async (req, res) => {

    const { comment, created_at, project_Id, task_Id } = req.body;

    try {
        const pid = await Project.findById(project_Id);
        if (!pid) {
            return res.status(400).send({ message: "The entered project name is invalid" });
        }
        const tid = await Task.findById(task_Id);
        if (!tid) {
            return res.status(400).send({ message: "The entered task id is invalid" });
        }

        const data = Comment.create({ comment, created_at, project_Id, task_Id });
        res.send("comment created successfully");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findAll = async (req, res) => {

    try {
        const data = await Comment.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findByProjectId = async (req, res) => {

    const id = req.params.id;

    try {
        const data = await Comment.findByProjectId(id);

        if (!data) {
            res.status(404).send({ message: "Comment not found" });
        }
        res.send(data);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Comment.update(id, req.body);
        res.send("comment updated successfully");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
         await Comment.delete(id);
        res.send("comment deleted");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteAll = async (req, res) => {

    try {
        await Comment.deleteAll();
        res.send("All comments deleted");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

