const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const username = process.env.DBUSER;
const password = process.env.DBPASS;
const dbip = process.env.DBIP;
const dbname = process.env.SQLDBNAME;

const dbConfig = {
    host        : dbip,
    user        : username,
    password    : password,
    database    : dbname
}

module.exports = dbConfig