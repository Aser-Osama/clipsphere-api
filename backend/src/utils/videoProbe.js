const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { randomUUID } = require('crypto');

const probeVideo = (buffer) => {
  return new Promise((resolve, reject) => {
    const tmpPath = path.join(os.tmpdir(), `clip-${randomUUID()}.tmp`);
    fs.writeFileSync(tmpPath, buffer);

    ffmpeg.ffprobe(tmpPath, (err, metadata) => {
      try {
        fs.unlinkSync(tmpPath);
      } catch (_) {
        // ignore cleanup error
      }

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
  });
};

module.exports = { probeVideo };
