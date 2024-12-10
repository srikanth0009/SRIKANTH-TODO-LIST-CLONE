const express = require('express');
const router = express.Router();
const projects = require("../controllers/projects.controller");


router.post("/",projects.create);
router.get("/",projects.findAll);
router.get("/:name",projects.findByName);
router.put("/:name",projects.update);
router.delete("/:name",projects.delete);
router.delete("/",projects.deleteAll);


module.exports = router;
