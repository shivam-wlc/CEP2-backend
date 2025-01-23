import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userRemarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
likeSchema.index({ videoId: 1 }); // Index on videoId for fast lookups
likeSchema.index({ users: 1 }); // Index on users for efficient queries

const Like = mongoose.model('Like', likeSchema);

export default Like;
