/*
 * Vyme
 * Repository : api
 * File : server.js
 * Licence : GNU GPL v3.0
*/

const express = require('express')
const app = express()
const logger = require('@savalet/easy-logs')
const req_logger = require('./utils/req_logger')
const mysql = require('./utils/mysql/mysql.js')
const srv_config = require('../config/server.json')

logger.info("The API is starting...")
logger.info(`   
  _   __                 ___   ___  ____
 | | / /_ ____ _  ___   / _ | / _ \\/  _/
 | |/ / // /  ' \\/ -_) / __ |/ ___// /
 |___/\\_, /_/_/_/\\__/ /_/ |_/_/  /___/
     /___/
`)

mysql.connect()

app.get('/', function (req, res) {
    res.send('Vyme api is running')
    req_logger.log(req, res, "/")
})
app.use('/users', require('./routes/users/index.js'));

app.listen(3000)
logger.info(`The API is listening on port ${srv_config.port}`)