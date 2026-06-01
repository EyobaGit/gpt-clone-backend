// import mysql from 'mysql2/promise';
// *****************Postgress sql*********
import pg from "pg";

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


// console.log({ host:process.env.DB_HOST,
//     user:process.env.DB_USER ,
//     password:process.env.DB_PASSWORD ,
//     database:process.env.DB_NAME })
export default db;