/*
 * Vyme
 * Repository : api
 * File : routes/media/stream/index.js
 * Licence : GNU GPL v3.0
*/

const router = require('express').Router()
const logger = require('@savalet/easy-logs')
const req_logger = require('../../../utils/req_logger')
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');
var fs = require('fs')
const route_name = "/media/stream"
logger.info(`${route_name} route loaded !`)

router.get('', function (req, res) {
        var videoPath = 'data/Dune.2021.MULTI.VFF.2160p.4KLight.HDR10.WebRip.x265.E-AC3.Atmos-BONBON.mkv';

        const ffmpegProcess = spawn('ffmpeg', [
            '-i', videoPath,
            //'-c:v', 'libx264',
            '-c:v', 'h264_nvenc',
            '-preset', 'fast',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'libvorbis',
            '-b:v', req.query.bitrate || '1M',
           // '-maxrate:v', req.query.max_bitrate || '3M',
            '-movflags', 'isml+frag_keyframe',
            '-f', 'mp4',
            'pipe:1'
        ]);
    
        ffmpegProcess.stderr.on('data', (data) => {
            logger.debug(`FFmpeg output: ${data}`);
        });

        res.set({
            'Content-Type': 'video/mp4',
            'Transfer-Encoding': 'chunked',
            'Content-Disposition': 'inline; filename="vyme-stream.mp4"',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Keep-Alive': 'timeout=120, max=600',
            //'Accept-Ranges': 'bytes'
        });
    
        ffmpegProcess.stdout.pipe(res);

        res.on('close', () => {
            logger.info('Connection closed, killing FFmpeg process...')
            ffmpegProcess.kill('SIGINT');
            logger.info('FFmpeg process killed')
        });
        req_logger.log(req, res, route_name)
})

module.exports = router