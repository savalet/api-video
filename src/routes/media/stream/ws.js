/*
 * Vyme
 * Repository : api
 * File : routes/media/stream/ws.js
 * Licence : GNU GPL v3.0
*/

const ws = require('express-ws');
const logger = require('@savalet/easy-logs')
const { spawn } = require('child_process');
const stream_config = require('../../../../config/stream.json')

function create(server) {
    var ffmpeg_process = null
    ws(server)
    logger.info('Websocket server created');

    server.ws('/media/stream/ws', (ws, req) => {
        logger.debug('[WS] Client connected');
        ws.on('message', (message) => {
            logger.debug(`[WS] Received message: ${message}`);
            if (message === 'ffmpeg') {
                ws.send('Launching FFMPEG...');
                var path = 'data/test.mkv';
                scale = null

                if (req.query.scale) {
                    scale = 'scale=' + req.query.scale
                }

                ffmpeg_process = spawn('ffmpeg', [
                    '-async', '1', // audio sync
                    '-ss', req.query.start_time || '00:00:01', // start time
                    '-i', path,
                    '-c:v', stream_config.video_codec,
                    '-preset', 'fast',
                    '-pix_fmt', 'yuv420p',
                    '-c:a', req.query.audio_codec || 'mp3',
                    '-vf', scale || 'scale=1920:-1', // retain aspect ratio
                    //'-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=black', // force aspect ratio and fill with black color if needed (no crop)
                    '-b:v', req.query.bitrate || '10M',
                    '-hls_time', '10',
                    '-hls_list_size', '0',
                    '-f', 'hls',
                    'cache/dune/stream.m3u8'
                    //'pipe:1'
                ])

                ffmpeg_process.stderr.on('data', (data) => {
                    if (data.length > 1) {
                        logger.debug(`FFMPEG output: ${data}`)
                        ws.send(`FFMPEG output: ${data}`);
                    }
                })
            }
        });

        ws.on('close', () => {
            logger.debug('[WS] Client disconnected')
            try {
                ffmpeg_process.kill('SIGINT')
                logger.info('FFMPEG process killed')
            } catch (e) {
                logger.error('Error while killing FFMPEG process', e)
            }
        });
    });
}
exports.create = create;
