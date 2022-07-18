const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "host.docker.internal",
  port: 5432,
  database: "postgres"
});

module.exports = pool;