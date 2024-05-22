/*
 * Vyme
 * Repository : api
 * File : utils/auth/middleware.js
 * Licence : GNU GPL v3.0
*/

const req_logger = require('../req_logger')

function middleware(req, res, next) {
    const isAuthenticated = true

    if (isAuthenticated) {
        next()
    } else {
        res.status(401).send({ error: 'Unauthorized' })
        req_logger.log(req, res)
    }
}

exports.middleware = middleware