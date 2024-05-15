/*
 * Vyme
 * Repository : api
 * File : utils/mysql/mysql.js
 * Licence : GNU GPL v3.0
*/

const mysql = require('mysql')
const logger = require('@savalet/easy-logs')
const sql_config = require('../../../config/sql.json')

const con = mysql.createConnection({
    host: sql_config.host,
    port: sql_config.port,
    database: sql_config.database,
    user: sql_config.user,
    password: sql_config.password
});

function connect() {
    con.connect(function (err) {
        if (err) {
            logger.error(`Database error !\n  ${err.stack}`)
            process.exit(1);
        }
    
        logger.info(`Database successfully connected ! (${con.threadId})`)
    })
}

exports.connect = connect
exports.con = con