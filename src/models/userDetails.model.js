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
        { name: 'Facebook', link: '' },
        { name: 'Instagram', link: '' },
        { name: 'LinkedIn', link: '' },
        { name: 'Twitter', link: '' },
        { name: 'Telegram', link: '' },
        { name: 'TikTok', link: '' },
        { name: 'YouTube', link: '' },
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
