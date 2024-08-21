import Filter from 'bad-words';
import { uploadToS3 } from '##/src/config/lib/S3.js';
import Video from '##/src/models/video.model.js';
import User from '##/src/models/user.model.js';
import { extractVideoId } from '##/src/utility/extractVideoId.js';
import Comment from '##/src/models/comment.model.js';
import Rating from '##/src/models/rating.model.js';
import Like from '##/src/models/like.model.js';

async function uploadVideo(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fileLink, ok } = await uploadToS3(req);
    if (!ok) {
      return res.status(400).json({ message: 'No file upload', ok: false });
    }

    const video = new Video({
      creatorId: userId,
      videoLink: fileLink,
    });
    await video.save();

    return res.status(201).json({
      message: 'Video uploaded successfully',
      data: { link: fileLink, creatorId: userId, video },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function uploadThumbnail(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { fileLink, ok } = await uploadToS3(req);

    if (!ok) {
      return res.status(400).json({ message: 'No file upload', ok: false });
    }
    return res.status(200).json({ message: 'Thumbnail uploaded successfully', link: fileLink });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function uploadYoutubeVideoURL(req, res) {
  try {
    const { userId } = req.params;
    const { title, description, language, category, tags, youtubeLink } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    const videoId = extractVideoId(youtubeLink);

    const saveVideo = new Video({
      creatorId: userId,
      title,
      description,
      language,
      category,
      tags,
      youtubeLink: true,
      videoLink: youtubeLink,
      youtubeVideoId: videoId,
    });

    await saveVideo.save();

    return res.status(201).json({ message: 'Video uploaded successfully', video: saveVideo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// async function getGeneralVideoData(req, res) {
//   try {
//     const { userId } = req.params;

//     const videos = await Video.find({ creatorId: userId });

//     if (!videos || videos.length === 0) {
//       return res.status(404).json({ message: 'No videos found' });
//     }

//     let totalLikes = 0;
//     let totalComments = 0;
//     let totalRatings = 0;
//     let totalRatingPoints = 0;

//     videos.forEach((video) => {
//       totalLikes += video.likes.length;
//       totalComments += video.comments.length;

//       totalRatings += video.ratings.length;
//       video.ratings.forEach((rating) => {
//         totalRatingPoints += rating.rating;
//       });

//       let averageRating = 0;
//       if (video.ratings.length > 0) {
//         averageRating = totalRatingPoints / video.ratings.length;
//       }
//       video.averageRating = averageRating;
//       video.save();
//     });

//     const totalVideo = await Video.countDocuments({ creatorId: userId });

//     return res.status(200).json({
//       data: {
//         totalLikes,
//         totalComments,
//         totalRatings,
//         averageRating: videos[0].averageRating,
//         totalVideos: totalVideo,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Something went wrong', error: error.message });
//   }
// }

// Get Author videos for CRUD by Original AUthor

async function getAllAuthorVideos(req, res) {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // Videos per page
    const searchQuery = req.query.search || '';

    if (!userId) {
      return res.status(400).json({ message: 'Creator id is required' });
    }

    // Calculate the number of videos to skip
    const skip = (page - 1) * limit;

    // Create a regex for the search query
    const searchRegex = new RegExp(searchQuery, 'i');

    // Fetch videos and total count concurrently for better performance
    const [videos, totalVideos] = await Promise.all([
      Video.find({
        creatorId: userId,
        title: searchRegex, // Assuming the title field is used for searching
      })
        .sort({ createdAt: -1 }) // Sort by date (latest first)
        .skip(skip)
        .limit(limit)
        .populate('creatorId', 'firstName lastName') // Include creator details
        .lean(), // Use lean to get plain JavaScript objects
      Video.countDocuments({
        creatorId: userId,
        title: searchRegex, // Counting with the same search criteria
      }),
    ]);

    if (videos.length === 0) {
      return res.status(404).json({ message: 'No videos found for this author' });
    }

    return res.status(200).json({
      message: 'Videos fetched successfully',
      videos,
      totalVideos,
      currentPage: page,
      totalPages: Math.ceil(totalVideos / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function updateVideo(req, res) {
  try {
    const { userId, videoId } = req.params;
    const { title, description, language, category, tags, thumbnail } = req.body;

    if (!userId || !videoId) {
      return res.status(400).json({ message: 'UserId and videoId are required' });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (language) updateFields.language = language;
    if (category) updateFields.category = category;
    if (tags) updateFields.tags = tags;
    if (thumbnail) updateFields.thumbnail = thumbnail;

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: updateFields },
      { new: true },
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function deleteVideo(req, res) {
  try {
    const { userId, videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.creatorId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

export {
  uploadVideo,
  uploadThumbnail,
  updateVideo,
  uploadYoutubeVideoURL,
  getAllAuthorVideos,
  deleteVideo,
};
