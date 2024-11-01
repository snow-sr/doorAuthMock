const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT;

const DOOR_KEY = process.env.DOOR_KEY;

const DB_USER = process.env.DBUSER;
const DB_PASS = process.env.DBPASS;
const EMAIL_HOST_USER = process.env.EMAIL_HOST_USER;
const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD;

const TEMP_DIR = path.join(__dirname, 'commands');

module.exports = {
    PORT,
    TEMP_DIR,
    DB_USER,
    DB_PASS,
    EMAIL_HOST_USER,
    EMAIL_HOST_PASSWORD,
    DOOR_KEY
  };