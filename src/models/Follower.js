const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Compound unique index
followerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Prevent self-follow
followerSchema.pre('save', function () {
  if (this.followerId.equals(this.followingId)) {
    throw new Error('Cannot follow yourself');
  }
});

module.exports = mongoose.model('Follower', followerSchema);
