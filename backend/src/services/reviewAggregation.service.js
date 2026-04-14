// Returns pipeline stages to add: averageRating, reviewCount, latestReviewAt
// These stages perform a $lookup from reviews collection and then $addFields
const getReviewAggregationStages = () => [
  {
    $lookup: {
      from: 'reviews',
      localField: '_id',
      foreignField: 'video',
      as: '_reviews'
    }
  },
  {
    $addFields: {
      averageRating: {
        $cond: {
          if: { $gt: [{ $size: '$_reviews' }, 0] },
          then: { $avg: '$_reviews.rating' },
          else: 0
        }
      },
      reviewCount: { $size: '$_reviews' },
      latestReviewAt: {
        $cond: {
          if: { $gt: [{ $size: '$_reviews' }, 0] },
          then: { $max: '$_reviews.createdAt' },
          else: new Date(0)
        }
      }
    }
  },
  {
    $project: { _reviews: 0 }
  }
];

module.exports = { getReviewAggregationStages };
