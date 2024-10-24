import mongoose from 'mongoose';

const SocialMedia = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      default: '',
    },
    link: {
      type: String,
      // required: true,
      default: '',
    },
  },

  {
    _id: false,
    timestamps: false,
    versionKey: false,
  },
);

const userDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    socialMediaLinks: {
      type: [SocialMedia],
      default: [
        { name: 'LinkedIn', link: '' },
        { name: 'Facebook', link: '' },
        { name: 'Instagram', link: '' },
        { name: 'TikTok', link: '' },
        { name: 'Twitter', link: '' },
        { name: 'YouTube', link: '' },
        { name: 'Telegram', link: '' },
      ],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Indexing the userId field for faster queries
userDetailsSchema.index({ userId: 1 });

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);

export default UserDetails;
