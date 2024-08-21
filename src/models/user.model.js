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
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// Indexing the email field for faster queries and ensuring uniqueness
userSchema.index({ email: 1 }, { unique: true });

// Adding compound indexes if there are frequent queries involving multiple fields
// For example, indexing status and role for queries involving both
userSchema.index({ status: 1, role: 1 });

const User = mongoose.model('User', userSchema);

export default User;
