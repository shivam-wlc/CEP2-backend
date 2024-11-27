import mongoose from 'mongoose';

const followerSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      //   required: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      //   required: true, // User being followed
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false, // Disables the `__v` version key field
  },
);

// Add compound index to optimize queries
followerSchema.index({ followerId: 1, followingId: 1 }, { unique: true }); // Ensures no duplicate follow relationships
followerSchema.index({ followingId: 1 }); // For efficient lookups of a user's followers
followerSchema.index({ followerId: 1 }); // For efficient lookups of a user's following

const Follower = mongoose.model('Follower', followerSchema);

export default Follower;
