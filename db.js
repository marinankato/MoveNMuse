const sqlite3 = require('sqlite3').verbose();

// Create or open the database file
const db = new sqlite3.Database('./database/movenmuse.db', (err) => {
  if (err) {
    console.error('Failed to connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// // Create Users table
// db.run(`
//   CREATE TABLE IF NOT EXISTS Users (
//     userId INTEGER PRIMARY KEY AUTOINCREMENT,
//     firstName VARCHAR(25),
//     lastName VARCHAR(25),
//     email TEXT NOT NULL UNIQUE,
//     password TEXT NOT NULL,
//     role VARCHAR(25),
//     phoneNo INTEGER,
//     loginDate TEXT,
//     logoutDate TEXT
//   )
// `);

module.exports = db;