const express = require('express');
const router = express.Router();
const tasks = require("../controllers/tasks.controller");
const joi = require('joi');

const schema = joi.object({
    content:joi.string().required(),
    project_Id:joi.number().integer().required(),
    description:joi.string().required(),
    due_Date:joi.date().required(),
    is_completed: joi.boolean(),
    created_at: joi.date().required()

});

const validateTask = (req,res,next) => {
    const {error} = schema.validate(req.body,{abortEarly:false});
    if(error){
        res.status(400).send({message:'Validation invalid'});
    }
    next();
}

router.post("/", validateTask, tasks.create);
router.get("/", tasks.findAll);
router.get("/:project_Id", tasks.findByProjectId);
router.put("/:id", validateTask, tasks.update);
router.delete("/:id", tasks.delete);
router.delete("/", tasks.deleteAll);

module.exports = router;

