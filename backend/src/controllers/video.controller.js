const videoService = require('../services/video.service');
const { asyncWrapper } = require('../middleware/errorHandler');

exports.createVideo = asyncWrapper(async (req, res) => {
  const video = await videoService.createVideo(req.user.id, req.body);
  res.status(201).json({ status: 'success', data: video });
});

exports.getVideos = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const videos = await videoService.getVideos(page, limit);
  res.json({ status: 'success', data: videos });
});

exports.updateVideo = asyncWrapper(async (req, res) => {
  const video = await videoService.updateVideo(req.params.id, req.body);
  res.json({ status: 'success', data: video });
});

exports.deleteVideo = asyncWrapper(async (req, res) => {
  await videoService.deleteVideo(req.params.id);
  res.json({ status: 'success', data: { message: 'Video deleted' } });
});

exports.addReview = asyncWrapper(async (req, res) => {
  const review = await videoService.addReview(req.user.id, req.params.id, req.body);
  res.status(201).json({ status: 'success', data: review });
});

const feedService = require('../services/feed.service');
const likeService = require('../services/like.service');

exports.getFollowingFeed = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await feedService.getFollowingFeed(req.user.id, page, limit);
  res.json({ status: 'success', results: result.videos.length, data: result });
});

exports.getTrendingFeed = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await feedService.getTrendingFeed(page, limit);
  res.json({ status: 'success', results: result.videos.length, data: result });
});

exports.likeVideo = asyncWrapper(async (req, res) => {
  const result = await likeService.likeVideo(req.user.id, req.params.id);
  res.status(201).json({ status: 'success', data: result });
});

exports.unlikeVideo = asyncWrapper(async (req, res) => {
  const result = await likeService.unlikeVideo(req.user.id, req.params.id);
  res.json({ status: 'success', data: result });
});
