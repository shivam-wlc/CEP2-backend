import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    dateOfBirth: {
      type: Date,
      default: () => {
        // Return a default UTC date if no date is provided
        return new Date(Date.UTC(2000, 0, 1)); // Default date (Jan 1, 2000)
      },
    },
    country: {
      type: String,
      default: '',
    },
    introBio: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    role: {
      type: Array,
      required: true,
      // enum: ['admin', 'user', 'creator'], // Add more roles as needed
      default: ['user'],
    },
    activeDashboard: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'deleted', 'blocked', 'suspended', 'pending'],
      default: 'active',
    },
    unique_id: {
      // Add unique_id field
      type: String,
      // required: true,
      // unique: true,
      // default: '',
    },
    // unique_id: {
    //   type: String,
    //   required: function () {
    //     return this.role !== 'creator';
    //   },
    // },
    // add new updated fileds according to design
    middleName: {
      type: String,
      default: '',
      trim: true,
    },
    username: {
      type: String,
      default: '',
      trim: true,
    },
    personalWebsite: {
      type: String,
      default: '',
      trim: true,
    },
    nationality: {
      type: String,
      default: '',
      trim: true,
    },
    telephone: {
      type: String,
      default: '',
      trim: true,
    },
    // for counsellors
    specialization: {
      type: String,
      default: '',
      trim: true,
    },
    experience: {
      type: String,
      default: '',
      trim: true,
    },
    middleName: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Indexing the email field for faster queries and ensuring uniqueness
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ unique_id: 1 }, { unique: true });
// Adding compound indexes if there are frequent queries involving multiple fields
// For example, indexing status and role for queries involving both
userSchema.index({ status: 1, role: 1 });

const User = mongoose.model('User', userSchema);

export default User;
