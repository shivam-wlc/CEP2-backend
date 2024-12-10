import Video from '##/src/models/video.model.js';
import Like from '##/src/models/like.model.js';
import UserHistory from '##/src/models/userHistory.model.js';

async function toggleLikeVideo(req, res) {
  try {
    const { videoId, userId } = req.body;

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if userId is provided
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find user's like status for the video
    const like = await Like.findOne({ videoId, userId });

    // Find or create the user history
    let userHistory = await UserHistory.findOne({ userId });
    if (!userHistory) {
      userHistory = new UserHistory({ userId });
    }

    if (like) {
      // User already liked the video, so remove the like and decrease totalLikes
      await Like.findByIdAndDelete(like._id);
      await video.updateOne({ $inc: { totalLikes: -1 } });

      // Remove the videoId from likedVideos in userHistory
      userHistory.likedVideos = userHistory.likedVideos.filter(
        (likedVideo) => likedVideo.videoId.toString() !== videoId.toString(),
      );
      await userHistory.save();

      return res.status(200).json({ message: 'Like removed successfully', userLiked: false });
    } else {
      // User hasn't liked the video yet, so add the like and increase totalLikes
      const newLike = new Like({ videoId, userId });
      await newLike.save();
      await video.updateOne({ $inc: { totalLikes: 1 } });

      // Add the videoId to likedVideos in userHistory
      userHistory.likedVideos.push({ videoId });
      await userHistory.save();

      return res.status(201).json({ message: 'Video liked successfully', userLiked: true });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

// we can send Like and Rating status in the same response

async function getLikeStatus(req, res) {
  try {
    const { videoId, userId } = req.params;
    const like = await Like.findOne({ videoId, userId });

    let userLiked = false;
    if (like) {
      userLiked = true;
    }
    return res.status(200).json({ message: 'Like status fetched successfully', userLiked });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

export { toggleLikeVideo, getLikeStatus };
