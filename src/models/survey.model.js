import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema(
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
    educationLevel: {
      type: String,
      required: true,
      default: '', // Default to empty string if not provided
    },
    gradePoints: {
      type: String,
      required: true,
      default: '', // Default to empty string if not provided
    },
    nextCareerStep: {
      type: String,
      required: true,
      default: '', // Default to empty string if not provided
    },
    mostAppealingField: {
      type: [String], // Array of strings
      required: true,
      default: [], // Default to empty array if not provided
    },
    preferredLocation: {
      type: [String], // Array of strings
      required: true,
      default: [], // Default to empty array if not provided
    },
    top3thingsForFuture: {
      type: [String], // Array of strings
      required: true,
      default: [], // Default to empty array if not provided
    },
    nationality: {
      type: String,
      default: '', // Default to empty string if not provided
    },
    selectedPathways: {
      type: [String], // Array of strings
      default: [], // Default to empty array if not provided
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
surveySchema.index({ userId: 1 });
surveySchema.index({ educationLevel: 1 });
surveySchema.index({ gradePoints: 1 });

const Survey = mongoose.model('Survey', surveySchema);

export default Survey;
