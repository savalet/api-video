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
const srv_config = require('../config/server.json')
const version = require('../package.json').version

logger.info("The API is starting...")
logger.info(`   
\x1b[0;36m  _   __                 ___   ___  ____
\x1b[0;36m | | / /_ ____ _  ___   / _ | / _ \\/  _/
\x1b[0;36m | |/ / // /  ' \\/ -_) / __ |/ ___// /
\x1b[0;36m |___/\\_, /_/_/_/\\__/ /_/ |_/_/  /___/
\x1b[0;36m     /___/    v${version} | vyme.dev\x1b[0;37m
`)

//mysql.connect()

app.get('/', function (req, res) {
    res.send('Vyme api is running')
    req_logger.log(req, res, "/")
})
app.use('/users', require('./routes/users/index.js'))
// app.use('/media/stream', require('./routes/media/stream/index.jsOLD'))
app.use('/media/stream/dl/:filename', require('./routes/media/stream/dl.js'))
const websock = require('./routes/media/stream/ws.js')
websock.create(app)

app.listen(3000)
logger.info(`The API is listening on port ${srv_config.port}`)
