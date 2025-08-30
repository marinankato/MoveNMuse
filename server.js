// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views'))); // Serve static files

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, user) => {
      if (err) {
        res.status(500).send('Server error');
      } else if (user) {
        res.send(`<h2>Welcome, ${user.email}!</h2>`);
      } else {
        res.send('<h2>Invalid email or password.</h2>');
      }
    }
  );
});
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // Temporary fake login check (replace with database logic later)
//   if (email === 't@test.com' && password === 'password123') {
//     res.send(`<h2>Logged in as, ${email}!</h2>`);
//   } else {
//     res.send('<h2>Login failed. Invalid email or password.</h2>');
//   }
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
