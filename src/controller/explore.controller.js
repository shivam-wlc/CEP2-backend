import Video from '##/src/models/video.model.js';

async function getAllVideos(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const searchQuery = req.query.search || '';
    const category = req.query.category || '';
    const tags = req.query.tags ? req.query.tags.split(',') : [];

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(searchQuery, 'i');

    // Construct the query filter
    const filter = {
      ...(searchQuery && { title: searchRegex }),
      ...(category && { category }), // Assuming 'category' is a field in your schema
      ...(tags.length > 0 && { tags: { $in: tags } }), // Assuming 'tags' is an array field in your schema
    };

    const [videos, totalVideos] = await Promise.all([
      Video.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('creatorId', 'firstName lastName')
        .lean(),
      Video.countDocuments(filter),
    ]);

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

async function getMostViewedThumbnails(req, res) {
  try {
    // Fetch the top 6 most viewed videos sorted by totalViews
    const videos = await Video.find().sort({ totalViews: -1 }).limit(6).lean();

    // Map over the videos to create the thumbnail links
    const thumbnails = videos.map((video) => {
      let thumbnailLink;

      // If video has a direct thumbnail URL
      if (video.thumbnail) {
        thumbnailLink = video.thumbnail;
      }
      // If video has a YouTube link, generate the thumbnail URL from YouTube video ID
      else if (video.youtubeLink && video.youtubeVideoId) {
        thumbnailLink = `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`;
      }

      return {
        title: video.title,
        videoLink: video.videoLink,
        thumbnail: thumbnailLink,
      };
    });

    return res.status(200).json({
      message: 'Thumbnails fetched successfully',
      thumbnails,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

export { getAllVideos, getMostViewedThumbnails };
