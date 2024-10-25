import Video from '##/src/models/video.model.js';

async function getAllVideos(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10; // Videos per page
    const searchQuery = req.query.search || '';

    // Calculate the number of videos to skip
    const skip = (page - 1) * limit;

    // Create a regex for the search query
    const searchRegex = new RegExp(searchQuery, 'i');

    const [videos, totalVideos] = await Promise.all([
      Video.find({
        title: searchRegex, // Assuming the title field is used for searching
      })
        .sort({ createdAt: -1 }) // Sort by date (latest first)
        .skip(skip)
        .limit(limit)
        .populate('creatorId', 'firstName lastName')
        .lean(), // Use lean to get plain JavaScript objects
      Video.countDocuments({
        title: searchRegex, // Counting with the same search criteria
      }),
    ]);

    console.log('videos', videos);

    return res.status(200).json({
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

export { getAllVideos };
