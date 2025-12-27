const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection - UPDATE THESE WITH YOUR DATABASE CREDENTIALS
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database');
});

// API Routes
app.get('/api/patients', (req, res) => {
  db.query('SELECT * FROM PATIENT LIMIT 10', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/api/appointments', (req, res) => {
  db.query(`
    SELECT a.*, p.FirstName as PatientFirstName, p.LastName as PatientLastName,
           doc.FirstName as ProviderFirstName, doc.LastName as ProviderLastName
    FROM APPOINTMENT a
    LEFT JOIN PATIENT p ON a.PatientID = p.PatientID
    LEFT JOIN PROVIDER doc ON a.ProviderID = doc.ProviderID
    LIMIT 10
  `, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/appointments', (req, res) => {
  const { StartDateTime, EndDateTime, PatientID, ProviderID, Reason } = req.body;
  db.query(
    'INSERT INTO APPOINTMENT (StartDateTime, EndDateTime, PatientID, ProviderID, Reason, Status) VALUES (?, ?, ?, ?, ?, ?)',
    [StartDateTime, EndDateTime, PatientID, ProviderID, Reason, 'Scheduled'],
    (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, message: 'Appointment created' });
    }
  );
});

app.listen(5000, () => {
  console.log('API server running on http://localhost:5000');
});