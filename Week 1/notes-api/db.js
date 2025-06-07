const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "notes_api_db", // change if you set a different database name
  password: "word",   // change if you set a different password
  port: 5432,
});

module.exports = pool;
