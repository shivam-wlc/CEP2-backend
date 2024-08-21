// import mongoose from 'mongoose';

// const userAnswerSchema = new mongoose.Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   answers: [
//     {
//       questionId: { type: Schema.Types.ObjectId, ref: 'DiscProfileQuestion', required: true },
//       selectedStatementIndex: { type: Number, required: true }, // Index of the selected statement
//       selectedOption: { type: String, enum: ['most', 'least'], required: true }, // "most" or "least"
//     },
//   ],
// });

// const DiscProfileAnswer = mongoose.model('DiscProfileAnswer', userAnswerSchema);
// export default DiscProfileAnswer;

import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema(
  {
    answers: [
      {
        questionNumber: {
          type: String,
          required: true,
        },
        questionAns: [
          {
            statementNumber: {
              type: Number,
              required: true,
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
        ],
      },
    ],
  },
  { timestamps: true },
);

const discAnswer = mongoose.model('Answer', AnswerSchema);

export default discAnswer;
