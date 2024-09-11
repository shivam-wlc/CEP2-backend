import Video from '##/src/models/video.model.js';
import User from '##/src/models/user.model.js';
import Rating from '##/src/models/rating.model.js';

async function rateVideo(req, res) {
  try {
    const { videoId, userId, rating: userRating } = req.body;

    // Validate required fields
    if (!videoId || !userId || userRating === undefined) {
      return res.status(400).json({ message: 'Video ID, User ID, and rating are required.' });
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find existing rating by the user
    let ratingRecord = await Rating.findOne({ videoId, userId });

    if (ratingRecord) {
      // User has already rated, update the rating
      ratingRecord.rating = userRating;
    } else {
      // Create a new rating
      ratingRecord = new Rating({ videoId, userId, rating: userRating });
      video.totalRatings += 1; // Increase total ratings count for the video
    }

    await ratingRecord.save();

    // Update the average rating for the video
    const totalRatingsCount = video.totalRatings;
    const newAverageRating =
      (video.averageRating * (totalRatingsCount - 1) + userRating) / totalRatingsCount;

    video.averageRating = newAverageRating;
    await video.save();

    return res.status(ratingRecord.isNew ? 201 : 200).json({
      message: ratingRecord.isNew ? 'Rating created successfully' : 'Rating updated successfully',
      averageRating: newAverageRating,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

export { rateVideo };
