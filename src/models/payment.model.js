import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessmentName: {
      type: String,
      required: true,
    },
    transactionID: {
      type: String,
      // required: true,
      // unique: true,
      default: '',
    },
    paymentStatus: {
      type: String,
      // required: true,
      enum: ['paid', 'failed', 'pending'],
      default: 'pending',
    },
    currency: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
paymentSchema.index({ userId: 1 }); // Index on userId for fast lookup
paymentSchema.index({ transactionID: 1 }, { unique: true }); // Index on transactionID to enforce uniqueness
paymentSchema.index({ paymentStatus: 1 }); // Index on paymentStatus for filtering by status
paymentSchema.index({ amount: 1 }); // Index on amount for queries based on payment amount

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
