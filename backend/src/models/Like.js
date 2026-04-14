const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true
    }
  },
  { timestamps: true }
);

// Compound unique index — one like per user per video
likeSchema.index({ user: 1, video: 1 }, { unique: true });
// Index for fast count queries by video
likeSchema.index({ video: 1 });

module.exports = mongoose.model('Like', likeSchema);
