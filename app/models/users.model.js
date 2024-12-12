
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

const User ={

    create : async (user) =>{
        const sql = "INSERT INTO users (name,email) VALUES (?,?)";
        const params = [user.name, user.email];
        return  await dbOperation(db.run.bind(db),sql,params);
    },

    findAll : async () => {
        const sql = "SELECT * FROM users";
         return await dbOperation(db.all.bind(db),sql);
    },

    findById : async (id) => {
            const sql = "SELECT * FROM users WHERE user_id = ? ";
            return await dbOperation(db.all.bind(db),sql,[id]);
    },

    update : async (id, user) => {
        const sql = "UPDATE users SET name = ?, email = ? WHERE user_id = ?";
        const params = [user.name, user.email];
        return await dbOperation(db.run.bind(db),sql,params);
    },  

    delete : async (id) => {
        const sql = "DELETE FROM users WHERE user_id = ?";
        return await dbOperation(db.run.bind(db),sql,[id]);
    },

    deleteAll : async () => {
        const sql = "DELETE FROM users";
        return await dbOperation(db.run.bind(db),sql);
    }
}

module.exports = User;
