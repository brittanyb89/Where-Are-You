const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    password: 'pAssioNate1!',
    database: 'employer_db'
  },
  console.log(`Connected to the employer_db database.`)
);

// Create a department
app.post('/api/department', ({ body }, res) => {
  const sql = `INSERT INTO department (name) VALUES (?)`;
  const params = [body.dept_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: body
    });
  });
});

// Read all departments
app.get('/api/department', (req, res) => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Read a single department
app.get('/api/department/:id', (req, res) => {
  const sql = `SELECT * FROM department WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql
    params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: row
    });
  });
});

// Update a department
app.put('/api/department/:id', (req, res) => {
  const sql = `UPDATE department SET name = ? WHERE id = ?`;
  const params = [req.body.dept_name, req.params.id];

  db.query(sql, params
    (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: 'Department not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete a department
app.delete('/api/department/:id', (req, res) => {
  const sql = `DELETE FROM department WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql
    params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // check if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Department not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});