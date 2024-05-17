/*
 * Vyme
 * Repository : api
 * File : routes/media/stream/index.js
 * Licence : GNU GPL v3.0
*/

const router = require('express').Router()
const logger = require('@savalet/easy-logs')
const req_logger = require('../../../utils/req_logger')
const { spawn } = require('child_process');
const route_name = "/media/stream"
logger.info(`${route_name} route loaded !`)

router.get('', function (req, res) {
    var path = 'data/Dune.2021.MULTI.VFF.2160p.4KLight.HDR10.WebRip.x265.E-AC3.Atmos-BONBON.mkv';
    scale = null

    if (req.query.scale) {
        scale = 'scale=' + req.query.scale
    }

    const ffmpeg = spawn('ffmpeg', [
        '-async', '1', // audio sync
        '-ss', req.query.start_time || '00:00:01', // start time
        '-i', path,
        //'-c:v', 'libx264', // CPU encoding (software)
        //'-c:v', 'h264_nvenc', // Nvidia GPU encoding (hardware)
        '-c:v', 'h264_amf', // AMD GPU encoding (hardware)
        '-preset', 'fast', // quality preset
        '-pix_fmt', 'yuv420p', // pixel format
        '-c:a', req.query.audio_codec || 'libvorbis', // audio codec
        '-vf', scale || 'scale=1920:-1', // retain aspect ratio
        //'-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=black', // force aspect ratio and fill with black color if needed (no crop)
        '-b:v', req.query.bitrate || '10M', // video bitrate
        '-movflags', 'isml+frag_keyframe',
        '-g', '30',
        '-force_key_frames', 'expr:gte(t,n_forced*2)',
        '-metadata', `start_time=${req.query.start_time || '00:02:00'}`, // Metadata for start time
        '-metadata', `end_time=${req.query.end_time || '00:10:00'}`, // Metadata for end time, default is 10 minutes
        '-f', 'mp4', // output format
        'pipe:1'
    ])

    ffmpeg.stderr.on('data', (data) => {
        if (data.length > 1) {
            logger.debug(`FFMPEG output: ${data}`)
        }
    })

    res.set({
        'Content-Type': 'video/mp4',
        'Transfer-Encoding': 'chunked',
        'Content-Disposition': 'inline; filename="vyme-stream.mp4"',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Keep-Alive': 'timeout=120, max=600',
    });

    ffmpeg.stdout.pipe(res)

    res.on('close', () => {
        logger.info('Connection closed, killing FFMPEG process...')
        try {
            ffmpeg.kill('SIGINT')
            logger.info('FFMPEG process killed')
        } catch (e) {
            logger.error('Error while killing FFMPEG process', e)
        }
    })
    req_logger.log(req, res, route_name)
})

module.exports = router
