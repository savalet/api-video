/*
 * Vyme
 * Repository : api
 * File : routes/users/index.js
 * Licence : GNU GPL v3.0
*/

const router = require('express').Router()
const logger = require('@savalet/easy-logs')
const req_logger = require('../../utils/req_logger')
const route_name = "/users"
logger.info(`${route_name} route loaded !`)

router.get('', function (req, res) {
    res.json({ "user": [] })
    req_logger.log(req, res, route_name)
})

module.exports = router