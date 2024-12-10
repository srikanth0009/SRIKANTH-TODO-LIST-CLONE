const Project = require('../models/projects.model');
const task = require("../models/tasks.model");

exports.create = (req,res)=>{
    const {name,color,is_favourite} = req.body;

    Project.create({name,color,is_favourite},(err,data)=>{
        if(err){
            res.status(500).send({message : err.message});
        }else{
            res.send(data);
        }
    });
};

exports.findAll = (req,res)=>{
    Project.findAll((err,data)=>{
        if(err){
            res.status(500).send({message : err.message});
        }else{
            res.send(data);
        }
    });
};

exports.findByName = (req,res)=>{
    const name = req.params.name;
    Project.findByName(name,(err,row)=>{
        if(err){
            res.status(500).send({message:err.message});
        }else 
        {
            if(!row){
                res.send(404).send({message : "find by name not found any project"});
            }else{
                //res.send(row);
                task.findByProjectName(name,(err,data)=>{
                    if(err){
                        res.send("Error in fetching tasks from project");
                    }else{
                        const result = {...row, ...data}; 
                        res.send(result);
                    }
                });
            }
        }
    });
};

exports.update = (req,res)=>{
    const name = req.params.name;
    Project.update(name,req.body,(err,data)=>{
        if(err){
            res.status(500).send({message:err.message});
        }else{
            res.send(data);
        }
    });
};

exports.delete = (req,res)=>{
    const name = req.params.name;
    Project.delete(name,(err)=> {
        if(err){
            res.status(500).send({message:err.message});
        }else{
            res.send("Project deleted");
        }
    });
};

exports.deleteAll = (req,res)=>{
    Project.deleteAll((err)=>{
        if(err){
            res.status(500).send({message: err.message});
        }else{
            res.send("All projects deleted");
        }
    });
};

