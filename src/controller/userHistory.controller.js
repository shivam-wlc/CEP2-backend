import UserHistory from '##/src/models/userHistory.model.js';
import languages from '##/src/utility/json/languages.js';

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

async function studentDashboardAnalytics(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
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
    // const watchedFlags = userHistory.watchedVideos
    //   .map((video) => {
    //     const videoLanguage = video.videoId.language;
    //     const languageObj = languages.find((lang) => lang.name === videoLanguage);
    //     return languageObj ? { language: languageObj.name, flag: languageObj.flag } : null;
    //   })
    //   .filter((flag) => flag !== null);
    const watchedFlags = userHistory.watchedVideos
      .map((video) => {
        const videoLanguage = video.videoId.language;
        const languageObj = languages.find((lang) => lang.name === videoLanguage);
        return languageObj ? { language: languageObj.name, flag: languageObj.flag } : null;
      })
      .filter((flag) => flag !== null) // Remove null values
      .reduce((uniqueFlags, currentFlag) => {
        // Check if the language already exists in the uniqueFlags array
        if (!uniqueFlags.some((flag) => flag.language === currentFlag.language)) {
          uniqueFlags.push(currentFlag); // Add unique flag if not already in the array
        }
        return uniqueFlags;
      }, []); // Initial empty array for the accumulator

    console.log('Unique watched flags:', watchedFlags);

    // Send back the analytics and flags
    return res.status(200).json({
      message: 'Dashboard analytics fetched successfully',
      analytics: {
        likesCount: likedCount,
        sharesCount: sharedCount,
        watchedCount: watchedCount,
        watchedFlags: watchedFlags,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

export { getUserHistory, studentDashboardAnalytics };
