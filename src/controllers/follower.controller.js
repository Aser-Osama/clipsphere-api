const followerService = require('../services/follower.service');
const { AppError, asyncWrapper } = require('../middleware/errorHandler');
const { objectIdParamSchema } = require('../validators/user.validators');

const validateObjectIdParam = (params) => {
  const parsed = objectIdParamSchema.safeParse(params);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues.map((i) => i.message).join(', '), 400);
  }
  return parsed.data.id;
};

exports.followUser = asyncWrapper(async (req, res) => {
  const targetUserId = validateObjectIdParam(req.params);
  await followerService.followUser(req.user.id, targetUserId);
  res.status(201).json({ status: 'success', data: { message: 'Followed' } });
});

exports.unfollowUser = asyncWrapper(async (req, res) => {
  const targetUserId = validateObjectIdParam(req.params);
  await followerService.unfollowUser(req.user.id, targetUserId);
  res.json({ status: 'success', data: { message: 'Unfollowed' } });
});

exports.getFollowers = asyncWrapper(async (req, res) => {
  const targetUserId = validateObjectIdParam(req.params);
  const followers = await followerService.getFollowers(targetUserId);
  res.json({ status: 'success', data: followers });
});

exports.getFollowing = asyncWrapper(async (req, res) => {
  const targetUserId = validateObjectIdParam(req.params);
  const following = await followerService.getFollowing(targetUserId);
  res.json({ status: 'success', data: following });
});
