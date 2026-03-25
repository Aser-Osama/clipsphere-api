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
    const err = new Error('Cannot follow yourself');
    err.name = 'ValidationError';
    err.errors = {
      followerId: { message: 'Cannot follow yourself' }
    };
    throw err;
  }
});

module.exports = mongoose.model('Follower', followerSchema);
