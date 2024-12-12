
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

const Comment ={

    create : async (commentData) =>{
        const sql = "INSERT INTO comments (comment, created_at, project_Id, task_Id) VALUES (?,?,?,?)";
        const params = [commentData.comment, commentData.created_at, commentData.project_Id, commentData.task_Id];
        return  await dbOperation(db.run.bind(db),sql,params);
    },

    findAll : async () => {
        const sql = "SELECT * FROM comments";
         return await dbOperation(db.all.bind(db),sql);
    },

    findById : async (id) => {
            const sql = "SELECT * FROM comments WHERE project_Id = ? ";
            return await dbOperation(db.all.bind(db),sql,[id]);
    },

    update : async (id, commentData) => {
        const sql = "UPDATE comments SET comment = ?, created_at = ?, project_Id = ?, task_Id = ? WHERE id = ?";
        const params = [commentData.comment, commentData.created_at, commentData.project_Id, commentData.task_Id];
         return await dbOperation(db.run.bind(db),sql,params);
    },  

    delete : async (id) => {
        const sql = "DELETE FROM comments WHERE id = ?";
        return await dbOperation(db.run.bind(db),sql,[id]);
    },

    deleteAll : async () => {
        const sql = "DELETE FROM comments";
        return await dbOperation(db.run.bind(db),sql);
    }
}

module.exports = Comment;
