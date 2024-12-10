
const db = require("./db");

db.serialize(()=>{
    db.run(
        `CREATE TABLE IF NOT EXISTS projects(
        name TEXT PRIMARY KEY,
        color TEXT,
        is_favourite BOOLEAN DEFAULT false
        )`
    );
});

const Project = {
    create : (project,callback)=>{
        const sql = "INSERT INTO projects (name,color,is_favourite) VALUES (?,?,?)";
        const params = [project.name, project.color, project.is_favourite];
        db.run(sql,params, (err)=>{
            callback(err,{name:this.lastname, ...project});
        })
    },

    findAll: (callback)=>{
        const sql = "SELECT * FROM projects";
        db.all(sql,[],(err,rows) => callback(err,rows));
    },

    findByName: (name, callback)=>{
        const sql = "SELECT * FROM projects WHERE name = ? ";
        db.get(sql,[name],(err,rows) => callback(err,rows));
    },

    update : (name,project,callback)=>{
        const sql = "UPDATE projects SET color = ?, is_favourite = ? WHERE name = ?";
        const params = [project.color, project.is_favourite, name];
        db.run(sql,params,(err)=> callback(err,{name:this.lastname, ...project}));
    },

    delete: (name,callback)=>{
        const sql = "DELETE FROM projects WHERE name = ?";
        db.run(sql,[name],(err)=> callback(err));
    },

    deleteAll : (callback)=>{
        const sql = "DELETE FROM projects";
        db.run(sql,[],(err)=> callback(err));
    }
}

module.exports = Project;
