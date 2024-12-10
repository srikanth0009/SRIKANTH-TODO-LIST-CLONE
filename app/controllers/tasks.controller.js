const db = require("../models/db");
const task = require("../models/tasks.model");
const project = require("../models/projects.model");

exports.create = (req,res)=>{
    const {content,project_name,description, due_Date, is_completed, created_at} = req.body;
    project.findByName(project_name,(err,row)=>{
        if(err){
            res.status(500).send({message:err.message});
        }else {
            if(!row){
                res.send("The entered project name is invalid");
            }else{
                task.create({content,project_name,description, due_Date, is_completed, created_at},(err,data)=>{
                    if(err){
                        res.status(500).send({message:err.message});
                    }else{
                        res.send(data);
                    }
                });
            }

        }
    })
};

exports.findAll = (req,res)=>{
    task.findAll((err,data)=>{
        if(err){
            res.status(500).send({message:err.message});
        }else{
            res.send(data);
        }
    });
};

exports.findByProjectName = (req,res)=>{
    const project_name = req.params.project_name;
    task.findByProjectName(project_name,(err,row)=>{
        if(err){
            res.status(500).send({message:err.message});
        }else if(!row){
            res.status(404).send({message:`With this project_name no task is there`});
        }else{
            res.send(row);
        }
    });
};

exports.update = (req,res)=>{
    const id = req.params.id;
    task.update(id,req.body,(err,data)=>{
        if(err){
            res.status(500).send({message:err.message});
        }else{
            res.send(data);
        }
    });
};

exports.delete = (req,res)=>{
    const id = req.params.id;
    task.delete(id,(err)=>{
        if(err){
            res.status(500).send({message:err.message});
        }else{
            res.send("Deleted successfully");
        }
    });
};

exports.deleteAll = (req,res)=>{
    task.deleteAll((err)=>{
        if(err){
            res.status(500).send({message:err.message});
        }else{
            res.send("Deleted all the tasks");
        }
    });
};

