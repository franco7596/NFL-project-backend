const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: "localhost",
  user: process.env.USER || "",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "",
});

exports.pool = pool;
