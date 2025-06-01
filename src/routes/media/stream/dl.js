/*
 * Vyme
 * Repository : api
 * File : routes/media/stream/dl.js
 * Licence : GNU GPL v3.0
*/

const router = require('express').Router({ mergeParams: true })
const path = require('path')
const fs = require('fs')
const logger = require('@savalet/easy-logs')
const req_logger = require('../../../utils/req_logger')
const auth = require('../../../utils/auth/middleware.js')
const staticDir = path.join(__dirname, '../../../../cache');

const route_name = "/stream/dl"

logger.info(`${route_name} route loaded`)

router.use(auth.middleware)
router.get('', function (req, res) {
    const filename = req.params.filename
    const filePath = path.join(staticDir, filename)

    res.set({
        'Access-Control-Allow-Origin': '*'
    });

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: 'File not found' })
            return
        }

        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(500).json({ error: 'Error sending file' })
            }
        })
    })
    req_logger.log(req, res, route_name)
})

module.exports = router
