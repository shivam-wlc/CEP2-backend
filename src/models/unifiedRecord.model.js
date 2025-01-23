// import mongoose from 'mongoose';

// const unifiedRecordSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     userDetailsId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'UserDetail',
//     },
//     interestProfile: {
//       isTaken: {
//         type: Boolean,
//         default: false,
//       },
//       isPaid: {
//         type: Boolean,
//         default: false,
//       },
//       assessmentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'InterestProfile',
//       },
//     },
//     discProfile: {
//       isTaken: {
//         type: Boolean,
//         default: false,
//       },
//       isPaid: {
//         type: Boolean,
//         default: false,
//       },
//       assessmentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'DiscProfile',
//       },
//     },
//     survey: {
//       isTaken: {
//         type: Boolean,
//         default: false,
//       },
//       surveyId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Survey',
//       },
//     },
//     // Add more fields as needed
//     resume: {
//       isCompleted: {
//         type: Boolean,
//         default: false,
//       },
//       resumeId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Resume',
//       },
//     },
//     unique_id: {
//       // Add unique_id field
//       type: String,
//       required: true,
//       unique: true,
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   },
// );

// // Indexes
// unifiedRecordSchema.index({ userId: 1 }); // Index on userId for fast lookups
// unifiedRecordSchema.index({ interestProfile: 1 }); // Index on interestProfile for quick access
// unifiedRecordSchema.index({ discProfile: 1 }); // Index on discProfile for quick access
// unifiedRecordSchema.index({ survey: 1 }); // Index on survey for quick access

// const UnifiedRecord = mongoose.model('UnifiedRecord', unifiedRecordSchema);

// export default UnifiedRecord;

// SECOND

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
    combinedPayment: {
      isPaid: {
        type: Boolean,
        default: false,
      },
      remainingAttempts: {
        type: Number,
        default: 3, // Initial attempts
      },
      lastPaymentDate: {
        type: Date, // To track the last payment date
      },
    },
    interestProfile: [
      {
        assessmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'InterestProfile',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isTaken: {
          type: Boolean,
          default: false,
        },
      },
    ],
    discProfile: [
      {
        assessmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DiscProfile',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isTaken: {
          type: Boolean,
          default: false,
        },
      },
    ],
    survey: [
      {
        surveyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Survey',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isTaken: {
          type: Boolean,
          default: false,
        },
      },
    ],
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
    cdrLinks: [
      {
        link: { type: String }, // Resume link
        status: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    unique_id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
unifiedRecordSchema.index({ userId: 1 }); // Index on userId for fast lookups

const UnifiedRecord = mongoose.model('UnifiedRecord', unifiedRecordSchema);

export default UnifiedRecord;
