const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT;

const DB_USER = process.env.DBUSER;
const DB_PASS = process.env.DBPASS;

const TEMP_DIR = path.join(__dirname, 'commands');

module.exports = {
    PORT,
    TEMP_DIR,
    DB_USER,
    DB_PASS,
  };