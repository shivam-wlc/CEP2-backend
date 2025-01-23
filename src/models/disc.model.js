// import mongoose from 'mongoose';

// const discProfileSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     payment: {
//       isPaid: {
//         type: Boolean,
//         default: false,
//       },
//       paymentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Payment',
//       },
//     },
//     // answers: [
//     //   {
//     //     questionNumber: {
//     //       type: String,
//     //       required: true,
//     //     },
//     //     questionAns: [
//     //       {
//     //         statementNumber: {
//     //           type: Number,
//     //           // required: true,
//     //         },
//     //         statementAns: {
//     //           most: {
//     //             type: String,
//     //           },
//     //           least: {
//     //             type: String,
//     //           },

//     //         },
//     //       },
//     //     ],
//     //   },
//     // ],
//     answers: [
//       {
//         questionNumber: {
//           type: String,
//           required: true,
//         },
//         questionAns: [
//           new mongoose.Schema(
//             {
//               statementNumber: {
//                 type: Number,
//                 // required: true,
//               },
//               statementAns: {
//                 most: {
//                   type: String,
//                 },
//                 least: {
//                   type: String,
//                 },
//               },
//             },
//             { _id: false },
//           ), // Disable automatic _id field
//         ],
//       },
//     ],
//     results: {
//       type: Map,
//       of: mongoose.Schema.Types.Mixed, // Allows storing various types of values
//       default: {}, // Default to empty object if not provided
//     },
//     suggestions: {
//       type: Map,
//       of: mongoose.Schema.Types.Mixed, // Allows storing various types of values
//       default: {}, // Default to empty object if not provided
//     },
//     scores: {
//       most: {
//         D: { type: Number, default: 0 },
//         I: { type: Number, default: 0 },
//         S: { type: Number, default: 0 },
//         C: { type: Number, default: 0 },
//         B: { type: Number, default: 0 },
//       },
//       least: {
//         D: { type: Number, default: 0 },
//         I: { type: Number, default: 0 },
//         S: { type: Number, default: 0 },
//         C: { type: Number, default: 0 },
//         B: { type: Number, default: 0 },
//       },
//       difference: {
//         D: { type: Number, default: 0 },
//         I: { type: Number, default: 0 },
//         S: { type: Number, default: 0 },
//         C: { type: Number, default: 0 },
//         B: { type: Number, default: 0 },
//       },
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   },
// );

// // Indexes
// discProfileSchema.index({ userId: 1 }); // Index on userId for fast lookups
// discProfileSchema.index({ 'payment.paymentId': 1 }); // Index on paymentId for efficient querying

// const DiscProfile = mongoose.model('DiscProfile', discProfileSchema);

// export default DiscProfile;

import mongoose from 'mongoose';

const statementSchema = new mongoose.Schema(
  {
    statementNumber: {
      type: Number,
    },
    statementAns: {
      most: {
        type: String,
      },
      least: {
        type: String,
      },
    },
  },
  { _id: false }, // Disable automatic _id field in questionAns array
);

const answerSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: String,
      required: true,
    },
    questionAns: [statementSchema], // Array of statementSchema without _id
  },
  { _id: false }, // Disable automatic _id field in answers array
);

const discProfileSchema = new mongoose.Schema(
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
    answers: [answerSchema], // Array of answerSchema without _id
    results: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    suggestions: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    scores: {
      most: {
        D: { type: Number, default: 0 },
        I: { type: Number, default: 0 },
        S: { type: Number, default: 0 },
        C: { type: Number, default: 0 },
        B: { type: Number, default: 0 },
      },
      least: {
        D: { type: Number, default: 0 },
        I: { type: Number, default: 0 },
        S: { type: Number, default: 0 },
        C: { type: Number, default: 0 },
        B: { type: Number, default: 0 },
      },
      difference: {
        D: { type: Number, default: 0 },
        I: { type: Number, default: 0 },
        S: { type: Number, default: 0 },
        C: { type: Number, default: 0 },
        B: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
discProfileSchema.index({ userId: 1 });
discProfileSchema.index({ 'payment.paymentId': 1 });

const DiscProfile = mongoose.model('DiscProfile', discProfileSchema);

export default DiscProfile;
