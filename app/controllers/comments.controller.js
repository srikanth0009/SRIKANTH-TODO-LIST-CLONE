const Comment = require('../models/comments.model');


exports.create = async (req, res) => {

    const { comment, created_at, project_Id, task_Id } = req.body;

    try {
        const data = Comment.create({ comment, created_at, project_Id, task_Id });
        res.send(data);
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

exports.findById = async (req, res) => {

    const id = req.params.id;

    try {
        const data = await Comment.findById(id);

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
        res.send(data);
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

