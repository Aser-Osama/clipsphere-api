const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfprobePath(ffprobePath);
const fs = require('fs');
const path = require('path');
const os = require('os');
const { randomUUID } = require('crypto');

const probeVideo = (buffer) => {
  const tmpPath = path.join(os.tmpdir(), `clip-${randomUUID()}.tmp`);

  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(tmpPath, buffer);
    } catch (writeErr) {
      return reject(writeErr);
    }

    ffmpeg.ffprobe(tmpPath, (err, metadata) => {
      if (err) return reject(err);

      const videoStream = metadata.streams.find(
        (s) => s.codec_type === 'video'
      );
      if (!videoStream) return reject(new Error('No video stream found'));

      resolve({
        duration: metadata.format.duration,
        width: videoStream.width,
        height: videoStream.height,
        codec: videoStream.codec_name,
      });
    });
  }).finally(() => {
    try {
      fs.unlinkSync(tmpPath);
    } catch (_) {
      // ignore cleanup error
    }
  });
};

module.exports = { probeVideo };
