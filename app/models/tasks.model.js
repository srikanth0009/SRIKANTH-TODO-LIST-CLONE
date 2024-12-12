const db = require("./db");

const promisifyDBOperation = (operation, sql, params = []) => {
  return new Promise((resolve, reject) => {
    operation(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const Task = {
  create: async (task) => {
    const sql =
      "INSERT INTO tasks (content, project_Id, description, due_Date, is_completed, created_at) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [
      task.content,
      task.project_Id,
      task.description,
      task.due_Date,
      task.is_completed,
      task.created_at,
    ];
    await promisifyDBOperation(db.run.bind(db), sql, params);
    return { ...task };
  },

  findAll: async (req) => {
    const { id, due_Date, is_completed, created_at } = req.query;
    let sql = "SELECT * FROM tasks";
    if (id) {
      sql += ` WHERE  project_Id=${id}`;
    }
    if (due_Date) {
      sql += ` AND due_Date = "${due_Date}"`;
    }
    if (is_completed) {
      sql += ` AND is_completed = ${is_completed}`;
    }
    if (created_at) {
      sql += ` AND created_at = "${created_at}"`;
    }

    return await promisifyDBOperation(db.all.bind(db), sql);
  },

  findByProjectId: async (project_Id) => {
    const sql = "SELECT * FROM tasks WHERE project_Id = ?";
    return await promisifyDBOperation(db.all.bind(db), sql, [project_Id]);
  },

  update: async (id, task) => {
    const sql =
      "UPDATE tasks SET content = ?, project_Id = ?, description = ?, due_Date = ?, is_completed = ?, created_at = ? WHERE task_Id = ?";
    const params = [
      task.content,
      task.project_Id,
      task.description,
      task.due_Date,
      task.is_completed,
      task.created_at,
      id,
    ];
    await promisifyDBOperation(db.run.bind(db), sql, params);
    return { id, ...task };
  },

  delete: async (id) => {
    const sql = "DELETE FROM tasks WHERE task_Id = ?";
    await promisifyDBOperation(db.run.bind(db), sql, [id]);
    return { message: "Task deleted" };
  },

  deleteAll: async () => {
    const sql = "DELETE FROM tasks";
    await promisifyDBOperation(db.run.bind(db), sql);
    return { message: "All tasks deleted" };
  },
};

module.exports = Task;
