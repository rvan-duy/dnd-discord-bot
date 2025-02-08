import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

const con = {
  query: async (text, params) => {
    console.log('Executing query:', text);
    return pool.query(text, params);
  }
};

export default con;
