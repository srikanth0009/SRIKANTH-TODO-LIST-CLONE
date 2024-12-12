const User = require('../models/users.model');
// const task = require("../models/tasks.model");


exports.create = async (req, res) => {

    const { name,email } = req.body;

    try {
        const data = User.create({ name,email });
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findAll = async (req, res) => {

    try {
        const data = await User.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.findById = async (req, res) => {

    const id = req.params.id;

    try {
        const data = await User.findById(id);

        if (!data) {
            res.status(404).send({ message: "user not found" });
        }
        res.send(data);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await User.update(id, req.body);
        res.send(data);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
         await User.delete(id);
        res.send("user deleted");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteAll = async (req, res) => {

    try {
        await User.deleteAll();
        res.send("All user deleted");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

