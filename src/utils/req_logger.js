/*
 * Vyme
 * Repository : api
 * File : utils/req_logger.js
 * Licence : GNU GPL v3.0
*/

const logger = require('@savalet/easy-logs')

function log(req, res, route_name) {
    let IP
    if (req.headers['x-forwarded-for'] == undefined)
        IP = req.socket.remoteAddress.replace("::ffff:", "")
    else
        IP = req.headers['x-forwarded-for'].split(',')[0]
    res.on('finish', () => {
        return logger.debug(`${req.method} ${route_name} [FINISHED] [FROM ${IP}] [CODE ${res.statusCode}]`)
    })
}

exports.log = log