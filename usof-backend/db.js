require('dotenv').config()
const mysql = require("mysql2");

const pool = mysql.createPool({
    connectionLimit:10,
    host:"localhost",
    password:'password',
    user:'amorozenko',
    database:'usof',
}).promise()

module.exports = pool
