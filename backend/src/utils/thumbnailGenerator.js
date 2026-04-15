const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { randomUUID } = require('crypto');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const generateThumbnail = (videoBuffer) => {
  const id = randomUUID();
  const tmpDir = os.tmpdir();
  const inputPath = path.join(tmpDir, `clip-thumb-${id}.tmp`);
  const outputPath = path.join(tmpDir, `clip-thumb-${id}.jpg`);

  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(inputPath, videoBuffer);
    } catch (err) {
      return reject(err);
    }

    ffmpeg(inputPath)
      .seekInput(1)
      .frames(1)
      .outputOptions(['-q:v', '4'])
      .output(outputPath)
      .on('end', () => {
        try {
          const thumbBuffer = fs.readFileSync(outputPath);
          resolve(thumbBuffer);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  }).finally(() => {
    try { fs.unlinkSync(inputPath); } catch (_) {}
    try { fs.unlinkSync(outputPath); } catch (_) {}
  });
};

module.exports = { generateThumbnail };
