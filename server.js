const express = require('express');

const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const projectsRouter = require("./app/routers/projects.router");
app.use("/projects" , projectsRouter);

const tasksRouter = require("./app/routers/tasks.router");
app.use("/tasks", tasksRouter);

app.listen(port,()=>{
    console.log(`Server started running on port ${port}`);
});

