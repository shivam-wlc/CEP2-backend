import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    playlistName: {
      type: String,
      required: true,
      trim: true,
      default: 'My Playlist',
    },
    videoId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
