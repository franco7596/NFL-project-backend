const { Pool } = require("pg");

const pool = new Pool({
	host: "localhost",
	user: "postgres",
	password: "Nfl*2023",
	database: "NFLDatabase",
});

exports.pool = pool;
