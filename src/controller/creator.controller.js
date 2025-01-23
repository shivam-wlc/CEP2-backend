import Filter from 'bad-words';
import { uploadToS3 } from '##/src/config/lib/S3.js';
import Video from '##/src/models/video.model.js';
import User from '##/src/models/user.model.js';
import { extractVideoId } from '##/src/utility/extractVideoId.js';
import Comment from '##/src/models/comment.model.js';
import Rating from '##/src/models/rating.model.js';
import Like from '##/src/models/like.model.js';
import Follower from '##/src/models/followers.model.js';
import UserDetails from '##/src/models/userDetails.model.js';
import userHistory from '##/src/models/userHistory.model.js';

// async function getUserAnalytics(req, res) {
//   try {
//     const { userId } = req.params; // User ID of the creator for analytics

//     // Fetch all watched history documents
//     const watchedHistories = await userHistory.find({});
//     const users = await User.find({}); // Fetch all users for demographics

//     if (!watchedHistories || watchedHistories.length === 0) {
//       return res.status(404).json({ message: 'No watched history found.' });
//     }

//     // Initialize a country count object
//     let countryCount = {};

//     // Loop through all watched history documents
//     for (let history of watchedHistories) {
//       let watchedVideos = history.watchedVideos;
//       let userIdFromHistory = history.userId; // Directly access userId from the document

//       // Skip if no watched videos in the document
//       if (!watchedVideos || watchedVideos.length === 0) {
//         continue;
//       }

//       // Loop through each watched video in the current document
//       for (let videoEntry of watchedVideos) {
//         let videoId = videoEntry.videoId?.$oid || videoEntry.videoId; // Handle nested `$oid`

//         if (!videoId) continue;

//         // Find the video by videoId
//         let video = await Video.findById(videoId);

//         if (!video) {
//           console.log(`Video not found: ${videoId}`);
//           continue;
//         }

//         // Check if the video was uploaded by the creator
//         if (video.creatorId.toString() === userId) {
//           // Find the user by userId from the watched history
//           let user = await User.findById(userIdFromHistory);

//           if (user && user.nationality) {
//             // Increase the count of users per nationality
//             countryCount[user.nationality] = (countryCount[user.nationality] || 0) + 1;
//           }
//         }
//       }
//     }

//     // Convert countryCount object to an array of objects
//     const userData = Object.entries(countryCount).map(([country, users]) => ({
//       country,
//       users,
//     }));

//     // Generate demographics data
//     let demographicsData = [
//       { name: '18-24', male: 0, female: 0 },
//       { name: '25-34', male: 0, female: 0 },
//       { name: '35-44', male: 0, female: 0 },
//       { name: '45-54', male: 0, female: 0 },
//       { name: '55-64', male: 0, female: 0 },
//       { name: '65+', male: 0, female: 0 },
//     ];

//     const currentYear = new Date().getFullYear();

//     for (let user of users) {
//       if (!user.dateOfBirth || !user.gender) continue;

//       const birthYear = new Date(user.dateOfBirth.$date || user.dateOfBirth).getFullYear();
//       const age = currentYear - birthYear;
//       const gender = user.gender.toLowerCase(); // Ensure gender is lowercase

//       // Determine the age group
//       let ageGroupIndex;
//       if (age >= 18 && age <= 24) ageGroupIndex = 0;
//       else if (age >= 25 && age <= 34) ageGroupIndex = 1;
//       else if (age >= 35 && age <= 44) ageGroupIndex = 2;
//       else if (age >= 45 && age <= 54) ageGroupIndex = 3;
//       else if (age >= 55 && age <= 64) ageGroupIndex = 4;
//       else if (age >= 65) ageGroupIndex = 5;

//       // Increment the appropriate gender count
//       if (ageGroupIndex !== undefined && (gender === 'male' || gender === 'female')) {
//         demographicsData[ageGroupIndex][gender]++;
//       }
//     }

//     // Respond with both user data and demographics data
//     res.status(200).json({ userData, demographicsData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching analytics data' });
//   }
// }

async function getUserAnalytics(req, res) {
  try {
    const { userId } = req.params; // User ID of the creator for analytics

    // Fetch all watched history documents
    const watchedHistories = await userHistory.find({});
    const users = await User.find({}); // Fetch all users for demographics

    if (!watchedHistories || watchedHistories.length === 0) {
      return res.status(404).json({ message: 'No watched history found.' });
    }

    // Initialize a country count object
    let countryCount = {};

    // Loop through all watched history documents
    for (let history of watchedHistories) {
      let watchedVideos = history.watchedVideos;
      let userIdFromHistory = history.userId; // Directly access userId from the document

      // Skip if no watched videos in the document
      if (!watchedVideos || watchedVideos.length === 0) {
        continue;
      }

      // Loop through each watched video in the current document
      for (let videoEntry of watchedVideos) {
        let videoId = videoEntry.videoId?.$oid || videoEntry.videoId; // Handle nested `$oid`

        if (!videoId) continue;

        // Find the video by videoId
        let video = await Video.findById(videoId);

        if (!video) {
          console.log(`Video not found: ${videoId}`);
          continue;
        }

        // Check if the video was uploaded by the creator
        if (video.creatorId.toString() === userId) {
          // Find the user by userId from the watched history
          let user = await User.findById(userIdFromHistory);

          if (user && user.nationality) {
            // Increase the count of users per nationality
            countryCount[user.nationality] = (countryCount[user.nationality] || 0) + 1;
          }
        }
      }
    }

    // Convert countryCount object to an array of objects
    const userData = Object.entries(countryCount).map(([country, users]) => ({
      country,
      users,
    }));

    // Generate demographics data
    let demographicsData = [
      { name: '16-18', male: 0, female: 0 },
      { name: '19-21', male: 0, female: 0 },
      { name: '22-24', male: 0, female: 0 },
      { name: '25-27', male: 0, female: 0 },
      { name: '28-30', male: 0, female: 0 },
      { name: '30+', male: 0, female: 0 },
    ];

    const currentYear = new Date().getFullYear();

    for (let user of users) {
      if (!user.dateOfBirth || !user.gender) continue;

      const birthYear = new Date(user.dateOfBirth.$date || user.dateOfBirth).getFullYear();
      const age = currentYear - birthYear;
      const gender = user.gender.toLowerCase(); // Ensure gender is lowercase

      // Determine the age group
      let ageGroupIndex;
      if (age >= 16 && age <= 18) ageGroupIndex = 0;
      else if (age >= 19 && age <= 21) ageGroupIndex = 1;
      else if (age >= 22 && age <= 24) ageGroupIndex = 2;
      else if (age >= 25 && age <= 27) ageGroupIndex = 3;
      else if (age >= 28 && age <= 30) ageGroupIndex = 4;
      else if (age > 30) ageGroupIndex = 5;

      // Increment the appropriate gender count
      if (ageGroupIndex !== undefined && (gender === 'male' || gender === 'female')) {
        demographicsData[ageGroupIndex][gender]++;
      }
    }

    // Respond with both user data and demographics data
    res.status(200).json({ userData, demographicsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
}

async function getMonthlyAnalytics(req, res) {
  try {
    const { userId } = req.params; // User ID of the creator for analytics

    // Fetch all videos uploaded by the creator
    const videos = await Video.find({ creatorId: userId });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found for the creator.' });
    }

    // Initialize monthly analytics data
    let monthlyData = [
      { name: 'Jan', likes: 0, followers: 0 },
      { name: 'Feb', likes: 0, followers: 0 },
      { name: 'Mar', likes: 0, followers: 0 },
      { name: 'Apr', likes: 0, followers: 0 },
      { name: 'May', likes: 0, followers: 0 },
      { name: 'Jun', likes: 0, followers: 0 },
      { name: 'Jul', likes: 0, followers: 0 },
      { name: 'Aug', likes: 0, followers: 0 },
      { name: 'Sep', likes: 0, followers: 0 },
      { name: 'Oct', likes: 0, followers: 0 },
      { name: 'Nov', likes: 0, followers: 0 },
      { name: 'Dec', likes: 0, followers: 0 },
    ];

    // Loop through each video
    for (let video of videos) {
      const createdAt = new Date(video.createdAt.$date || video.createdAt); // Handle nested `$date`
      const monthIndex = createdAt.getMonth(); // Get month index (0 for Jan, 11 for Dec)

      if (monthIndex >= 0 && monthIndex < 12) {
        // Increment likes and followers for the respective month
        monthlyData[monthIndex].likes += video.totalLikes || 0;
        monthlyData[monthIndex].followers += video.totalViews || 0; // Assuming followers come from views
      }
    }

    // Respond with the monthly data
    res.status(200).json({ monthlyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching monthly analytics data' });
  }
}

async function uploadVideo(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fileLink, ok } = await uploadToS3(req, 'videos');
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
    const { fileLink, ok } = await uploadToS3(req, 'thumbnails');

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

async function getCreatorProfile(req, res) {
  const { userId } = req.params;

  try {
    // Run both queries in parallel for better performance
    const [user, followerCount, userDetails] = await Promise.all([
      User.findById(userId).select(
        '-password -updatedAt -role -createdAt -unique_id -isEmailVerified',
      ), // Fetch user details excluding the password
      Follower.countDocuments({ followingId: userId }), // Count followers
      UserDetails.findOne({ userId }).select('socialMediaLinks').lean(),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const socialMediaLinks = userDetails ? userDetails.socialMediaLinks : [];

    // Send user details along with the follower count
    return res.status(200).json({
      user,
      followerCount,
      socialMediaLinks,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

async function videoDetailById(req, res) {
  try {
    const { videoId } = req.params;
    const videoDetails = await Video.findById(videoId);

    if (!videoDetails) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const { creatorId } = videoDetails;

    const creatorDetails = await User.findById(creatorId).select(
      'firstName lastName profilePicture',
    );

    if (!creatorDetails) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    return res.status(200).json({
      message: 'Video details fetched successfully',
      videoDetails,
      creatorDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function getGeneralVideoData(req, res) {
  try {
    const { userId } = req.params;

    // Fetch videos created by the user
    const videos = await Video.find({ creatorId: userId });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found' });
    }

    // Initialize counters for aggregation
    let totalLikes = 0;
    let totalComments = 0;
    let totalRatings = 0;
    let totalRatingPoints = 0;
    let totalVideos = videos.length;
    let totalShares = 0;
    let totalViews = 0;

    // Iterate through each video to calculate likes, comments, ratings, and average ratings
    for (const video of videos) {
      totalLikes += video.totalLikes;
      totalComments += video.totalComments;
      totalRatings += video.totalRatings;
      totalRatingPoints += video.averageRating * video.totalRatings; // Multiply average by total ratings to get total rating points
      totalShares += video.totalShares;
      totalViews += video.totalViews;

      // Calculate the video's average rating
      let averageRating = 0;
      if (video.totalRatings > 0) {
        averageRating = totalRatingPoints / totalRatings;
      }
      // Update the video's average rating (optional, if you want to save this to the database)
      video.averageRating = averageRating;
      // await video.save();
    }

    // Calculate total number of videos by the user
    const totalVideoCount = await Video.countDocuments({ creatorId: userId });

    // Calculate the overall average rating
    let overallAverageRating = 0;
    if (totalRatings > 0) {
      overallAverageRating = totalRatingPoints / totalRatings;
    }

    // Return aggregated data
    return res.status(200).json({
      data: {
        totalLikes,
        totalComments,
        totalRatings,
        overallAverageRating,
        totalVideos: totalVideoCount,
        totalShares,
        totalViews,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
}

// async function getUserAnalytics(req, res) {
//   try {
//     const { userId } = req.params; // You may need this to fetch user-specific data if required

//     // Fetch users grouped by nationality
//     const userStats = await User.aggregate([
//       { $group: { _id: '$nationality', count: { $sum: 1 } } },
//       { $project: { country: '$_id', users: '$count', _id: 0 } },
//     ]);

//     // Prepare the response
//     const response = userStats.map((item) => ({
//       country: item.country,
//       users: item.users,
//     }));

//     // Respond with the aggregated data
//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching analytics data' });
//   }
// }

export {
  uploadVideo,
  uploadThumbnail,
  updateVideo,
  uploadYoutubeVideoURL,
  getAllAuthorVideos,
  deleteVideo,
  getCreatorProfile,
  videoDetailById,
  getGeneralVideoData,
  getUserAnalytics,
  getMonthlyAnalytics,
};
