const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
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

// Prevent duplicate reviews by same user on same video
reviewSchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
