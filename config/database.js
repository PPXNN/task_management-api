const mysql = require("mysql2/promise");
require("dotenv").config();

let db = null;

const initMySQL = async () => {
    if (db) return db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        console.log("MySQL connection successful");
        return db;
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
        throw error;
    }
};

module.exports = initMySQL;
