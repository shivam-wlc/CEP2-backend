import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoLink: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      // required: true,
    },
    tags: {
      type: Array,
    },
    language: {
      type: String,
      // required: true,
    },
    youtubeLink: {
      type: Boolean,
      default: false,
    },
    youtubeVideoId: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Education',
        'Guidance',
        'Career Development',
        'College Tour',
        'Admission',
        'Other',
        'Internships',
        'Scholarships',
        'SoftSkills',
        'Career Planning',
      ],
      // required: true,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    // total rating count for the video
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    totalShares: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

videoSchema.index({ creatorId: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ category: 1 });

const Video = mongoose.model('Video', videoSchema);

export default Video;

// example

// import Video from './models/videoSchema.js';
// import Comment from './models/commentSchema.js';
// import Like from './models/likeSchema.js';
// import Rating from './models/ratingSchema.js';

// // Fetch video and related data
// async function getVideoWithDetails(videoId) {
//   const video = await Video.findById(videoId);
//   const comments = await Comment.find({ videoId });
//   const likes = await Like.find({ videoId });
//   const ratings = await Rating.find({ videoId });

//   // Calculate average rating
//   const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length || 0;

//   return {
//     video,
//     comments,
//     likes,
//     ratings,
//     averageRating
//   };
// }
