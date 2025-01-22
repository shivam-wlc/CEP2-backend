import mongoose from 'mongoose';

const interestProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: true, // Track attempt number (1, 2, 3, etc.)
    },
    payment: {
      isPaid: {
        type: Boolean,
        default: false,
      },
      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    },
    answers: {
      type: String,
      default: '', // Default to empty string if not provided
    },
    results: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Allows storing various types of values
      default: {}, // Default to empty object if not provided
    },
    careers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Allows storing various types of values
      default: {}, // Default to empty object if not provided
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
interestProfileSchema.index({ userId: 1 }); // Index on userId for fast lookups
interestProfileSchema.index({ 'payment.paymentId': 1 });

const InterestProfile = mongoose.model('InterestProfile', interestProfileSchema);

export default InterestProfile;
