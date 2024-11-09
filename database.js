// database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'shashanka',
  host: '127.0.0.1',            // or your PostgreSQL server IP
  database: 'student',
  password: 'shashank@2003',
  port: 5432,                   // default PostgreSQL port
});

// Connect to the database and log the connection status
pool.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Export the pool to be used in other files
module.exports = pool;
