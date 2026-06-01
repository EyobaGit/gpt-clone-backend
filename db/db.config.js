// import mysql from 'mysql2/promise';
// *****************Postgress sql*********


// const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



export default db;