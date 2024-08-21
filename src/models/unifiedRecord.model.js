import mongoose from 'mongoose';

const unifiedRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserDetail',
    },
    interestProfile: {
      isTaken: {
        type: Boolean,
        default: false,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InterestProfile',
      },
    },
    discProfile: {
      isTaken: {
        type: Boolean,
        default: false,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiscProfile',
      },
    },
    survey: {
      isTaken: {
        type: Boolean,
        default: false,
      },
      surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
      },
    },
    // Add more fields as needed
    resume: {
      isCompleted: {
        type: Boolean,
        default: false,
      },
      resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
unifiedRecordSchema.index({ userId: 1 }); // Index on userId for fast lookups
unifiedRecordSchema.index({ interestProfile: 1 }); // Index on interestProfile for quick access
unifiedRecordSchema.index({ discProfile: 1 }); // Index on discProfile for quick access
unifiedRecordSchema.index({ survey: 1 }); // Index on survey for quick access

const UnifiedRecord = mongoose.model('UnifiedRecord', unifiedRecordSchema);

export default UnifiedRecord;
