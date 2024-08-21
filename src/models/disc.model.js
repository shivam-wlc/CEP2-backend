import mongoose from 'mongoose';

const discProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    suggestions: {
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
discProfileSchema.index({ userId: 1 }); // Index on userId for fast lookups
discProfileSchema.index({ 'payment.paymentId': 1 }); // Index on paymentId for efficient querying

const DiscProfile = mongoose.model('DiscProfile', discProfileSchema);

export default DiscProfile;
