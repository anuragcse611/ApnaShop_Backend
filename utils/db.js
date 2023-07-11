const mysql = require('mysql2');

const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const username = process.env.DBUSER;
const password = process.env.DBPASS;
const dbip = process.env.DBIP;
const dbname = process.env.SQLDBNAME;

function createPool() {
  try {

    const pool = mysql.createPool({
      host    : dbip,
      user    : username,
      database: dbname,
      password: password,
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 4
    });

    const promisePool = pool.promise();

    return promisePool;
  } catch (error) {
    return console.log(`Could not connect - ${error}`);
  }
}

const pool = createPool();

module.exports = {
  connection: async () => pool.getConnection(),
  execute: (...params) => pool.execute(...params)
};