const express = require('express');
const router = express.Router();
const comments = require("../controllers/comments.controller");
const joi = require('joi');

const schema = joi.object({
    comment:joi.string().required(),
    created_at: joi.date().required(),
    project_Id:joi.number().integer().required(),
    task_Id: joi.number().integer().required(),
});

const validateComment = (req,res,next) => {
    const {error} = schema.validate(req.body,{abortEarly:false});
    if(error){
        res.status(400).send({message:'comment Validation invalid'});
    }
    next();
}

router.post("/", validateComment, comments.create);
router.get("/", comments.findAll);
router.get("/:id", comments.findById);
router.put("/:id", validateComment, comments.update);
router.delete("/:id", comments.delete);
router.delete("/", comments.deleteAll);


module.exports = router;

