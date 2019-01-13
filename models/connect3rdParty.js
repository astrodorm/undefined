const sql = require('mssql');

const config = {
  user: process.env.user,
  password: process.env.password,
  server: process.env.server,
  database: process.env.database
};

let pool = new sql.ConnectionPool(config);

pool.connect();
pool.on('error', err => {
  console.log(err.message);
});

module.exports = pool;
