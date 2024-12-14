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


const populateUsers = async (db, totalRows) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO users (name,email) VALUES ( ?, ?) ");
    for (let i = 0; i < totalRows; i++) {
      stmt.run(faker.person.fullName(), faker.internet.email());
    }
    stmt.finalize((err) => {
      if (err) reject(err);
      else {
        console.log("Users data created");
        resolve();
      }
    });
  });
};

const populateComments = async (db, totalRows) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT INTO comments (comment,created_at,project_Id,task_Id) VALUES ( ?, ?, ?, ?) "
    );
    for (let i = 0; i < totalRows; i++) {
      stmt.run(
        faker.lorem.sentence(),
        faker.date.past(1).toISOString(),
        faker.number.int({ min: 1, max: 2000 }),
        faker.number.int({ min: 1, max: 5000 })
      );
    }
    stmt.finalize((err) => {
      if (err) reject(err);
      else {
        console.log(" COMMENTS TABLE DATA created");
        resolve();
      }
    });
  });
};


// Function to generate and insert project data
const generateProjects = async (db) => {  

  console.log("Project Insertion Time",db);

  db.serialize(() => {

    db.run("BEGIN TRANSACTION;", (err) => {
      if (err) console.error("Failed to begin transaction: ", err.message);
    });

    const BATCH_SIZE = 1000; 
    const TOTAL_PROJECTS = 100000; 

    const insertBatch = (batch) => {
      return new Promise((resolve, reject) => {
        const placeholders = batch.map(() => "(?, ?, ?, ?)").join(", ");
        const flatValues = batch.flat();
        const query = `INSERT INTO projects (project_name, color, is_favourite, user_id) VALUES ${placeholders}`;

        db.run(query, flatValues, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    };

    const insertProjects = async () => {
      let batch = [];
      for (let i = 1; i <= TOTAL_PROJECTS; i++) {
        const projectName = faker.commerce.productName();
        const projectColor = faker.color.human();
        const isFavorite = Math.random() < 0.5 ? 1 : 0; 
        const userId = faker.number.int({ min: 1, max: 100000 }); // 1 million projects


        batch.push([projectName, projectColor, isFavorite, userId]);

        if (i % BATCH_SIZE === 0 || i === TOTAL_PROJECTS) {
          try {
            await insertBatch(batch);
            console.log(`Inserted batch of ${BATCH_SIZE} projects.`);
            batch = []; 
          } catch (err) {
            console.error(`Failed to insert projects batch: ${err.message}`);
          }
        }
      }
    };

    insertProjects()
      .then(() => {
        db.run("COMMIT;", (err) => {
          if (err) console.error("Failed to commit transaction: ", err.message);
          console.log("All projects inserted successfully.");
          console.timeEnd("Project Insertion Time");
          db.close((err) => {
            if (err) console.error("Failed to close database: ", err.message);
          });
        });
      })
      .catch((err) => {
        console.error("Error during task data insertion: ", err.message);
        db.run("ROLLBACK;", () => db.close());
      });
  });
};

const generateTasks = async () => {
  console.time("Task Insertion Time");

  db.serialize(() => {
    // Start a transaction
    db.run("BEGIN TRANSACTION;", (err) => {
      if (err) console.error("Failed to begin transaction: ", err.message);
    });

    const insertBatch = (batch) => {
      return new Promise((resolve, reject) => {

        const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?)").join(",");    
        const flatValues = batch.flat(); // Flatten the batch into a single array
        const query = `INSERT INTO tasks (content, project_Id, description, due_date, is_completed, created_at) VALUES ${placeholders}`;
    
        db.run(query, flatValues, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    };

    const BATCH_SIZE = 1000; // Insert in batches of 100,000
    const totalTasks = 10000000;
    let batch = [];

    const insertTasks = async () => {
      for (let i = 1; i <= totalTasks; i++) {
        const content = faker.lorem.sentence().replace(/'/g, "''");
        const project_Id = faker.number.int({ min: 1, max: 100000 }); // 1 million projects
        const description = faker.lorem.paragraph().replace(/'/g, "''");
        const due_date = faker.date.future().toISOString().split('T')[0];
        const is_completed = faker.datatype.boolean();
        const created_at = faker.date.past().toISOString().split("T")[0]; // Random creation date in the past

        // Push a single row
        batch.push(`('${content}',${project_Id}, '${description}', '${due_date}', ${is_completed},'${created_at}' )`);

        // Execute batch insert
        if (i % BATCH_SIZE === 0 || i === totalTasks) {
          console.log(`Inserting ${i} / ${totalTasks} tasks...`);
          try {
            await insertBatch(batch);
            batch = []; // Clear the batch
          } catch (err) {
            console.error(`Failed to insert batch: ${err.message}`);
          }
        }
      }
    };

    insertTasks()
      .then(() => {
        db.run("COMMIT;", (err) => {
          if (err) console.error("Failed to commit transaction: ", err.message);
          console.log("All tasks inserted successfully.");
          console.timeEnd("Task Insertion Time");
          db.close((err) => {
            if (err) console.error("Failed to close database: ", err.message);
          });
        });
      })
      .catch((err) => {
        console.error("Error during task data insertion: ", err.message);
        db.run("ROLLBACK;", () => db.close());
      });
  });
};

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
    // await createTable(db, queries);

    // await populateUsers(db, 1000000);

    generateProjects(db);
    generateTasks(db);
    
    // await populateProjectsTable(db, 1);
    // await populateTasksTable(db, 5000);

    //await populateComments(db, 1000);
  } catch (error) {
    console.error("Error:", error.message);
  } 
};

main();
