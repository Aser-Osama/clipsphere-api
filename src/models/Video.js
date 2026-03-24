const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    videoURL: {
      type: String,
      required: true
    },
    key: {
      type: String
    },
    duration: {
      type: Number,
      required: true,
      max: 300 // 5 minutes
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['public', 'private', 'flagged'],
      default: 'public'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
