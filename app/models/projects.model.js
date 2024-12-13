
const db = require("./db");

const dbOperation = (operation,sql,params=[]) => {
    return new Promise((resolve,reject)=>{
        operation(sql,params,(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const Project ={

    create : async (project) =>{
        const sql = "INSERT INTO projects (project_name,color,is_favourite,user_id) VALUES (?,?,?,?)";
        const params = [project.project_name, project.color, project.is_favourite,project.user_id];
        return  await dbOperation(db.run.bind(db),sql,params);
    },

    findAll : async () => {
        const sql = "SELECT * FROM projects";
         return await dbOperation(db.all.bind(db),sql);
    },

    findByUserId : async (id) => {
            const sql = "SELECT * FROM projects WHERE user_id = ? ";
            return await dbOperation(db.all.bind(db),sql,[id]);
    },

    update : async (id, project) => {
        const sql = "UPDATE projects SET project_name = ?, color = ?, is_favourite = ?, user_id = ? WHERE id = ?";
         const params = [project.project_name,project.color, project.is_favourite,project.user_id, id];
         return await dbOperation(db.run.bind(db),sql,params);
    },  

    delete : async (id) => {
        const sql = "DELETE FROM projects WHERE id = ?";
        return await dbOperation(db.run.bind(db),sql,[id]);
    },

    deleteAll : async () => {
        const sql = "DELETE FROM projects";
        return await dbOperation(db.run.bind(db),sql);
    }
}

module.exports = Project;
