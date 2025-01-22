import UserHistory from '##/src/models/userHistory.model.js';
import languages from '##/src/utility/json/languages.js';
import Follower from '##/src/models/followers.model.js';
import studentUnifiedRecord from '##/src/models/unifiedRecord.model.js';
import Resume from '##/src/models/resume.model.js';
import Video from '##/src/models/video.model.js';
import User from '##/src/models/user.model.js';

async function getUserHistory(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
    const userHistory = await UserHistory.findOne({ userId }).populate([
      {
        path: 'watchedVideos.videoId',
        select:
          'title description videoLink youtubeLink youtubeVideoId totalRatings averageRating totalShares', // Fetch only necessary fields.
      },
      {
        path: 'likedVideos.videoId',
        select:
          'title description videoLink youtubeLink youtubeVideoId totalRatings averageRating totalShares',
      },
      {
        path: 'sharedVideos.videoId',
        select:
          'title description videoLink youtubeLink youtubeVideoId totalRatings averageRating totalShares',
      },
    ]);

    if (!userHistory) {
      return res.status(404).json({ message: 'User history not found' });
    }
    return res.status(200).json({ userHistory });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function getUserLikedHistory(req, res) {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Liked videos per page

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    // Fetch user history and count the total liked videos
    const userHistory = await UserHistory.findOne({ userId }).populate([
      {
        path: 'likedVideos.videoId',
        select:
          'title description videoLink youtubeLink youtubeVideoId totalRatings averageRating totalShares',
      },
    ]);

    if (!userHistory) {
      return res.status(404).json({ message: 'User history not found' });
    }

    // Get the liked videos and apply pagination
    const likedVideos = userHistory.likedVideos.slice(skip, skip + limit);

    // Count the total liked videos
    const totalLikedVideos = userHistory.likedVideos.length;

    return res.status(200).json({
      message: 'User liked videos fetched successfully',
      likedVideos,
      totalLikedVideos,
      currentPage: page,
      totalPages: Math.ceil(totalLikedVideos / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function studentDashboardAnalytics(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const followCount = await Follower.findOne({ followerId: userId }).countDocuments();
    const unifiedRecord = await studentUnifiedRecord.findOne({ userId }); // Fetch single record as per your schema
    const resumeCount = await Resume.findOne({ userId }).countDocuments();

    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Unified record not found.' });
    }

    const remainingAttempts = unifiedRecord.combinedPayment.remainingAttempts;

    let totalAssessments = 0;

    const countValidAssessments = (profile, idKey) => {
      return profile.filter((item) => item[idKey] && item[idKey].toString() !== '').length;
    };

    const interestProfileAssessments = countValidAssessments(
      unifiedRecord.interestProfile,
      'assessmentId',
    );
    const discProfileAssessments = countValidAssessments(unifiedRecord.discProfile, 'assessmentId');
    const surveyAssessments = countValidAssessments(unifiedRecord.survey, 'surveyId'); // Survey uses surveyId

    if (
      interestProfileAssessments === discProfileAssessments &&
      discProfileAssessments === surveyAssessments
    ) {
      totalAssessments = surveyAssessments;
    } else {
      totalAssessments = 0;
    }

    // Fetch the user history data
    const userHistory = await UserHistory.findOne({ userId }).populate([
      {
        path: 'watchedVideos.videoId',
        select:
          'title description videoLink youtubeLink youtubeVideoId totalRatings averageRating totalShares language',
      },
      {
        path: 'likedVideos.videoId',
        select:
          'title description videoLink youtubeLink youtubeVideoId totalRatings averageRating totalShares language',
      },
      {
        path: 'sharedVideos.videoId',
        select:
          'title description videoLink youtubeLink youtubeVideoId totalRatings averageRating totalShares language',
      },
    ]);

    if (!userHistory) {
      return res.status(404).json({ message: 'User history not found' });
    }

    // Count the likes, shares, and watched videos
    const likedCount = userHistory.likedVideos.length;
    const sharedCount = userHistory.sharedVideos.length;
    const watchedCount = userHistory.watchedVideos.length;

    console.log('userHistory watchedVideos', userHistory.watchedVideos);
    console.log('likedCount', likedCount);
    console.log('sharedCount', sharedCount);
    console.log('watchedCount', watchedCount);

    // Create an array of flags based on the language of the watched videos
    const watchedFlags = userHistory.watchedVideos
      .map((video) => {
        const videoLanguage = video.videoId.language;
        const languageObj = languages.find((lang) => lang.name === videoLanguage);
        return languageObj ? { language: languageObj.name, flag: languageObj.flag } : null;
      })
      .filter((flag) => flag !== null)
      .reduce((uniqueFlags, currentFlag) => {
        if (!uniqueFlags.some((flag) => flag.language === currentFlag.language)) {
          uniqueFlags.push(currentFlag);
        }
        return uniqueFlags;
      }, []);

    console.log('Unique watched flags:', watchedFlags);

    // Send back the analytics and flags
    return res.status(200).json({
      message: 'Dashboard analytics fetched successfully',
      analytics: {
        likesCount: likedCount,
        sharesCount: sharedCount,
        watchedCount: watchedCount,
        watchedFlags: watchedFlags,
        followCount: followCount,
        totalAssessments: totalAssessments,
        resumeCount: resumeCount,
        remainingAttempts: remainingAttempts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function saveSharedVideo(req, res) {
  try {
    const { userId, videoId } = req.body; // Assuming the request body contains userId and videoId

    if (!userId || !videoId) {
      return res.status(400).json({ message: 'User ID and Video ID are required.' });
    }

    const video = await Video.findById(videoId);

    // Find the user's history or create a new one if it doesn't exist
    let userHistory = await UserHistory.findOne({ userId });

    if (!userHistory) {
      // If no user history exists, create a new one
      userHistory = new UserHistory({ userId, sharedVideos: [] });
    }

    // Check if the video has already been shared by the user
    const videoAlreadyShared = userHistory.sharedVideos.some(
      (shared) => shared.videoId.toString() === videoId,
    );

    if (videoAlreadyShared) {
      return res.status(200).json({ message: 'Video has already been shared.' });
    }

    // Add the new shared video record
    userHistory.sharedVideos.push({
      videoId,
      sharedAt: new Date(),
    });

    await video.updateOne({ $inc: { totalShares: 1 } });

    // Save the updated user history
    await userHistory.save();

    return res.status(200).json({ message: 'Video shared successfully', userHistory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function saveAndUpdateNotes(req, res) {
  try {
    const { userId, notes, videoId } = req.body;

    // Find the user by userId
    const user = await UserHistory.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the video already exists in likedVideos
    const videoIndex = user.likedVideos.findIndex((video) => video.videoId.toString() === videoId);

    if (videoIndex !== -1) {
      // Update the existing note
      user.likedVideos[videoIndex].myNotes = notes;
    } else {
      // Add new video with notes
      user.likedVideos.push({
        videoId: videoId,
        myNotes: notes,
        likedAt: new Date(),
      });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Notes saved/updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}

export {
  getUserHistory,
  studentDashboardAnalytics,
  saveSharedVideo,
  getUserLikedHistory,
  saveAndUpdateNotes,
};
