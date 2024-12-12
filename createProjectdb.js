const db = require("./app/models/db");

const { faker } = require("@faker-js/faker");


const createTable = (db, queries) => {
  return new Promise((resolve, reject) => {
    queries.forEach((query) => {
      db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Table created");
          resolve();
        }
      });
    });
  });
};

const populateProjectsTable = (db, totalRows) => {

  const stmt = db.prepare(`INSERT INTO projects (project_name,color,is_favourite,user_id) VALUES (?,?,?, ?)`);

  return new Promise((resolve, reject) => {

    for (let i = 0; i < totalRows; i++) {
      stmt.run(
        faker.commerce.productName(),
        faker.color.human(),
        faker.datatype.boolean(),
        faker.number.int({ min: 1, max: 100 }),
      );
    }
    stmt.finalize((err) => {
      if (err) reject(err);

      else {
        console.log("Table data added");
        resolve();
      }
    });
  });
};

const populateTasksTable = (db, totalRows) => {
  const stmt2 = db.prepare(`INSERT INTO tasks (content,project_Id, description, due_Date, is_completed, created_at) VALUES (?, ?, ?, ?, ?, ?)`);

 return new Promise ((resolve,reject)=>{
  for (let i = 0; i < totalRows; i++) {
    stmt2.run(
       faker.lorem.sentence(),
       faker.number.int({ min: 1, max: 2000 }),
       faker.lorem.paragraph(),
       faker.date.soon(30).toISOString().split('T')[0],
       faker.datatype.boolean(),
       faker.date.past(1).toISOString().split('T')[0]
    );
  }

  stmt2.finalize((err)=>{
    if(err){
      reject(err);
    }else{
      console.log('Tasks table data created');
      resolve();
    }
  });
 });
}

const populateUsers = async (db,totalRows) => {
  return new Promise((resolve,reject)=>{
    const stmt = db.prepare("INSERT INTO users (name,email) VALUES ( ?, ?) ");
    for(let i=0;i<totalRows;i++){
      stmt.run(
         faker.person.fullName(),
         faker.internet.email(),
      );
    }
    stmt.finalize((err)=>{
      if(err) reject(err);
      else {
        console.log("Users data created");
        resolve();
      }
    });
  });
}

const populateComments = async (db,totalRows) => {
  return new Promise((resolve,reject)=>{
    const stmt = db.prepare("INSERT INTO comments (comment,created_at,project_Id,task_Id) VALUES ( ?, ?, ?, ?) ");
    for(let i=0;i<totalRows;i++){
      stmt.run(
        faker.lorem.sentence(),
        faker.date.past(1).toISOString() ,
        faker.number.int({ min: 1, max: 2000 }),
        faker.number.int({ min: 1, max: 5000 }),
      );
    }
    stmt.finalize((err)=>{
      if(err) reject(err);
      else {
        console.log(" COMMENTS TABLE DATA created");
        resolve();
      }
    });
  });
}

const main = async () => {

  const queries = [

    `  CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_name TEXT NOT NULL,
        color TEXT NOT NULL,
        is_favourite BOOLEAN DEFAULT FALSE,
        user_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS tasks (
        task_Id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        project_Id INTEGER,
        description TEXT,
        due_Date DATE,
        is_completed BOOLEAN,
        created_at DATE,
        FOREIGN KEY(project_Id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS comments 
      ( id INTEGER PRIMARY KEY AUTOINCREMENT,
       comment TEXT NOT NULL,
       created_at TIMESTAMP,
       project_Id INTEGER,
       task_Id INTEGER,
       FOREIGN KEY(project_Id) REFERENCES projects(id) ON DELETE CASCADE,
       FOREIGN KEY(TASK_Id) REFERENCES tasks(task_Id) ON DELETE CASCADE
      )
    `,
  ];

  try {

     await createTable(db, queries);

     await populateUsers(db,100);

     await populateProjectsTable(db, 2000);

     await populateTasksTable(db,5000);

     await populateComments(db,1000);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    db.close();
  }
};

main();
