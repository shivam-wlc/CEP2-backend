import mongoose from 'mongoose';

const userHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    watchedVideos: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Video',
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likedVideos: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Video',
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
userHistorySchema.index({ userId: 1 });
userHistorySchema.index({ 'watchedVideos.videoId': 1 });
userHistorySchema.index({ 'likedVideos.videoId': 1 });

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

export default UserHistory;
