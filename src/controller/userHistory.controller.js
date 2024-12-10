import UserHistory from '##/src/models/userHistory.model.js';

async function getUserHistory(req, res) {
  try {
    const { userId } = req.params;
    console.log('shivam');
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

export { getUserHistory };
