const followerService = require('../services/follower.service');
const { asyncWrapper } = require('../middleware/errorHandler');

exports.followUser = asyncWrapper(async (req, res) => {
  await followerService.followUser(req.user.id, req.params.id);
  res.status(201).json({ status: 'success', data: { message: 'Followed' } });
});

exports.unfollowUser = asyncWrapper(async (req, res) => {
  await followerService.unfollowUser(req.user.id, req.params.id);
  res.json({ status: 'success', data: { message: 'Unfollowed' } });
});

exports.getFollowers = asyncWrapper(async (req, res) => {
  const followers = await followerService.getFollowers(req.params.id);
  res.json({ status: 'success', data: followers });
});

exports.getFollowing = asyncWrapper(async (req, res) => {
  const following = await followerService.getFollowing(req.params.id);
  res.json({ status: 'success', data: following });
});
