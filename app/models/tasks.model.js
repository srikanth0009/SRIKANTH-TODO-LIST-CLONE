const db = require("./db");

db.serialize(()=>{
    db.run( 
        `CREATE TABLE IF NOT EXISTS tasks (
            task_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            project_name TEXT,
            description TEXT,
            due_Date TIMESTAMP,
            is_completed BOOLEAN,
            created_at TIMESTAMP,
            FOREIGN KEY(project_name) REFERENCES projects(name)
        )`
    );
});

const Task = {
    create : (task,callback)=>{
        
        const sql = "INSERT INTO tasks (content, project_name, description, due_Date, is_completed, created_at) values (?, ?, ?, ?, ?, ?)";
        console.log(task);
        const params = [task.content, task.project_name, task.description, task.due_Date, task.is_completed, task.created_at];
        db.run(sql,params,(err)=>{
            callback(err,{id:this.task_ID, ...task})
        });
    },

    findAll : (callback)=>{
        const sql = "SELECT * FROM tasks";
        db.all(sql,[],(err,data)=> callback(err,data));
    },

    findByProjectName : (name,callback)=>{
        const sql = "SELECT * FROM  tasks WHERE project_name = ? ";
        db.all(sql,[name],(err,data) => callback(err,data));
    },

    update : (id,task,callback)=>{
        const sql = "UPDATE tasks SET content = ?, project_name = ?, description = ?, due_Date = ?, is_completed = ?, created_at = ? WHERE task_ID = ? ";
        const params = [task.content, task.project_name,task.description, task.due_Date, task.is_completed, task.created_at,id];
        db.run(sql,params,(err)=> callback(err,{id:this.task_ID, ...task}));
    },

    delete : (id,callback)=>{
        const sql = "DELETE FROM tasks WHERE task_ID = ?";
        db.run(sql,[id],(err)=> callback(err));
    },

    deleteAll : (callback)=>{
        const sql = "DELETE FROM tasks";
        db.run(sql,[],(err)=> callback(err));
    }
}

module.exports = Task;

