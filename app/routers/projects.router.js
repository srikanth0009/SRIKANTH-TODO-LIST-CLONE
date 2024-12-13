const express = require('express');
const router = express.Router();
const projects = require("../controllers/projects.controller");
const joi = require('joi');

const schema = joi.object({
    project_name:joi.string().required(),
    color:joi.string().required(),
    is_favourite:joi.boolean(),
    user_id:joi.number().integer().required()
});

const validateProject = (req,res,next) => {
    const {error} = schema.validate(req.body,{abortEarly:false});
    if(error){
        return res.status(400).send({message: ' Project Validation invalid'});
    }
    next();
}

router.post("/", validateProject, projects.create);
router.get("/",projects.findAll);
router.get("/:id",projects.findByUserId);
router.put("/:id", validateProject, projects.update);
router.delete("/:id",projects.delete);
router.delete("/",projects.deleteAll);


module.exports = router;
