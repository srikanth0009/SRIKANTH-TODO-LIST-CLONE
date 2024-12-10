const express = require('express');
const router = express.Router();
const tasks = require("../controllers/tasks.controller");

router.post("/", tasks.create);
router.get("/", tasks.findAll);
router.get("/:project_name", tasks.findByProjectName);
router.put("/:id", tasks.update);
router.delete("/:id", tasks.delete);
router.delete("/", tasks.deleteAll);

module.exports = router;

