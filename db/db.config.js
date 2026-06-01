// import mysql from 'mysql2/promise';
// *****************Postgress sql*********
import { pool } from "pg";

// const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default db;
