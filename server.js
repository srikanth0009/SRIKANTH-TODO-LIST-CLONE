require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./app/routers/users.router');
const projectsRouter = require("./app/routers/projects.router");
const tasksRouter = require("./app/routers/tasks.router");
const commentRouter = require('./app/routers/comments.router');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use("/users", userRouter);
app.use("/projects" , projectsRouter);
app.use("/tasks", tasksRouter);
app.use("/comments", commentRouter);


app.listen(port,()=>{
    console.log(`Server started running on port ${port}`);
});

