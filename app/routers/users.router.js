const express = require('express');
const router = express.Router();
const users = require("../controllers/users.controller");
const joi = require('joi');

const schema = joi.object({
    name:joi.string().required(),
    email:joi.string().email().required()
});

const validateUser = (req,res,next) => {
    const {error} = schema.validate(req.body,{abortEarly:false});
    if(error){
        return res.status(400).send({message: ' User Validation invalid'});
    }
    next();
}

router.post("/", validateUser, users.create);
router.get("/",users.findAll);
router.get("/:id",users.findById);
router.put("/:id", validateUser, users.update);
router.delete("/:id",users.delete);
router.delete("/",users.deleteAll);


module.exports = router;
