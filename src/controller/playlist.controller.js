import Playlist from '##/src/models/playlist.model.js';
import User from '##/src/models/user.model.js';
import UserHistory from '##/src/models/userHistory.model.js';
import Rating from '##/src/models/rating.model.js';

async function createPlaylist(req, res) {
  try {
    const { playlistName, userId } = req.body;

    // Validate input
    if (!playlistName || !userId) {
      return res.status(400).json({ message: 'Playlist name and userId are required.' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create a new playlist
    const newPlaylist = new Playlist({
      userId,
      playlistName,
    });

    // Save playlist to the database
    const savedPlaylist = await newPlaylist.save();

    res.status(201).json({
      message: 'Playlist created successfully.',
      playlist: savedPlaylist,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong, please try again.',
      error: error.message,
    });
  }
}

async function deletePlaylist(req, res) {
  try {
    const { playlistId } = req.params;

    // Validate playlistId
    if (!playlistId) {
      return res.status(400).json({ message: 'Playlist ID is required.' });
    }

    // Find and delete the playlist
    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
    if (!deletedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found.' });
    }

    res.status(200).json({ message: 'Playlist deleted successfully.' });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong, please try again.',
      error: error.message,
    });
  }
}

async function addVideoToPlaylist(req, res) {
  try {
    const { playlistId, videoId } = req.body;

    // Validate input
    if (!playlistId || !videoId) {
      return res.status(400).json({ message: 'Playlist ID and Video ID are required.' });
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found.' });
    }

    // Add video to playlist
    if (!playlist.videoId.includes(videoId)) {
      playlist.videoId.push(videoId);
      await playlist.save();
    }

    res.status(200).json({ message: 'Video added to playlist successfully.', playlist });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong, please try again.',
      error: error.message,
    });
  }
}

async function removeVideoFromPlaylist(req, res) {
  try {
    const { playlistId, videoId } = req.body;

    // Validate input
    if (!playlistId || !videoId) {
      return res.status(400).json({ message: 'Playlist ID and Video ID are required.' });
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found.' });
    }

    // Remove video from playlist
    const videoIndex = playlist.videoId.indexOf(videoId);
    if (videoIndex !== -1) {
      playlist.videoId.splice(videoIndex, 1);
      await playlist.save();
    }

    res.status(200).json({ message: 'Video removed from playlist successfully.', playlist });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong, please try again.',
      error: error.message,
    });
  }
}

async function moveVideoToDifferentPlaylist(req, res) {
  try {
    const { sourcePlaylistId, targetPlaylistId, videoId } = req.body;

    // Validate input
    if (!sourcePlaylistId || !targetPlaylistId || !videoId) {
      return res
        .status(400)
        .json({ message: 'Source playlist ID, target playlist ID, and video ID are required.' });
    }

    // Find the source playlist
    const sourcePlaylist = await Playlist.findById(sourcePlaylistId);
    if (!sourcePlaylist) {
      return res.status(404).json({ message: 'Source playlist not found.' });
    }

    // Check if the video exists in the source playlist
    const videoIndex = sourcePlaylist.videoId.indexOf(videoId);
    if (videoIndex === -1) {
      return res.status(400).json({ message: 'Video not found in the source playlist.' });
    }

    // Find the target playlist
    const targetPlaylist = await Playlist.findById(targetPlaylistId);
    if (!targetPlaylist) {
      return res.status(404).json({ message: 'Target playlist not found.' });
    }

    // Remove the video from the source playlist
    sourcePlaylist.videoId.splice(videoIndex, 1);
    await sourcePlaylist.save();

    // Add the video to the target playlist if not already present
    if (!targetPlaylist.videoId.includes(videoId)) {
      targetPlaylist.videoId.push(videoId);
      await targetPlaylist.save();
    }

    res.status(200).json({
      message: 'Video moved to a different playlist successfully.',
      sourcePlaylist,
      targetPlaylist,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong, please try again.',
      error: error.message,
    });
  }
}

async function getUserPlaylist(req, res) {
  try {
    const { userId } = req.params;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Fetch user history in one query (only necessary fields)
    const userHistory = await UserHistory.findOne({ userId }).lean();
    if (!userHistory) {
      return res.status(404).json({ message: 'No history found for this user.' });
    }

    // Create quick lookups using Map for fast existence checks
    const watchedVideosMap = new Map(
      userHistory.watchedVideos.map((video) => [video.videoId.toString(), true]),
    );
    const likedVideosMap = new Map(
      userHistory.likedVideos.map((video) => [video.videoId.toString(), true]),
    );
    const sharedVideosMap = new Map(
      userHistory.sharedVideos.map((video) => [video.videoId.toString(), true]),
    );

    // Find playlists by userId and populate only necessary fields (using lean for faster response)
    const playlists = await Playlist.find({ userId })
      .populate(
        'videoId',
        'title description totalRatings averageRating totalLikes totalShares youtubeLink youtubeVideoId videoLink thumbnail',
      )
      .lean();

    if (!playlists || playlists.length === 0) {
      return res.status(404).json({ message: 'No playlists found for this user.' });
    }

    // Prepare playlist names
    const playlistNames = playlists.map((playlist) => ({
      playlistName: playlist.playlistName,
      playlistId: playlist._id,
    }));

    // Add status and rating to each video in the playlists
    const playlistsWithStatus = await Promise.all(
      playlists.map(async (playlist) => {
        const videosWithStatus = await Promise.all(
          playlist.videoId.map(async (video) => {
            // Using the pre-processed maps for fast lookups
            const watched = watchedVideosMap.has(video._id.toString());
            const liked = likedVideosMap.has(video._id.toString());
            const shared = sharedVideosMap.has(video._id.toString());

            // Check if the video is rated by the user
            const ratingDoc = await Rating.findOne({ videoId: video._id, userId }).lean();
            const rated = !!ratingDoc; // Check if the user has rated the video
            const rating = rated ? ratingDoc.rating : null; // Get the rating value if it exists

            return {
              ...video,
              watched,
              liked,
              shared,
              rated,
              rating, // Add the rating to the video data
            };
          }),
        );

        return {
          ...playlist,
          videoId: videosWithStatus,
        };
      }),
    );

    res.status(200).json({
      message: 'Playlists fetched successfully.',
      playlistsData: playlistsWithStatus,
      playlistNamesAll: playlistNames,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong, please try again.',
      error: error.message,
    });
  }
}

export {
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  moveVideoToDifferentPlaylist,
  getUserPlaylist,
};
