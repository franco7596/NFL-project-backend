const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // host: process.env.DATABASE_URL || "localhost",
  // user: process.env.USER || "postgres",
  // password: process.env.PASSWORD || "Nfl*2023",
  // database: process.env.DATABASE || "NFLDatabase",
});

exports.pool = pool;
