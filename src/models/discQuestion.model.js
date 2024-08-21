// import mongoose from 'mongoose';

// const { Schema } = mongoose;

// const statementSchema = new Schema({
//   text: { type: String, required: true }, // The text of the statement
//   category: { type: String, required: true }, // Category ("D", "I", "S", "C")
// });

// const questionSchema = new Schema({
//   questionText: { type: String, required: true }, // Optional: The text of the question
//   statements: [statementSchema], // Array of statements
// });

// const discQuestionSchema = new Schema(
//   {
//     questions: [questionSchema], // Array of questions with statements
//     results: {
//       // To store final calculated results
//       D: { type: Number, default: 0 },
//       I: { type: Number, default: 0 },
//       S: { type: Number, default: 0 },
//       C: { type: Number, default: 0 },
//       Blank: { type: Number, default: 0 },
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   },
// );

// const DiscProfileQuestion = mongoose.model('DiscProfileQuestion', discQuestionSchema);

// export default DiscProfileQuestion;

import mongoose from 'mongoose';

const { Schema } = mongoose;

// const statementSchema = new Schema({
//   text: { type: String, required: true }, // The text of the statement
//   category: { type: String, required: true }, // Category ("D", "I", "S", "C")
// });

// const questionSchema = new Schema({
//   questionText: { type: String, required: true }, // The text of the question
//   statements: [statementSchema], // Array of statements
// });

// const discQuestionSchema = new Schema(
//   {
//     questions: [questionSchema], // Array of questions with statements
//   },
//   {
//     timestamps: false, // Automatically manages createdAt and updatedAt fields
//     versionKey: false, // Removes the __v field from the schema
//   },
// );

// const DiscProfileQuestion = mongoose.model('DiscProfileQuestion', discQuestionSchema);

// export default DiscProfileQuestion;

const statementSchema = new Schema(
  {
    statementText: { type: String, required: true }, // The text of the statement
    category: {
      // An object with 'most' and 'least' options
      most: { type: String, default: '' },
      least: { type: String, default: '' },
    },
  },
  {
    _id: false,
  },
); 

const discQuestionSchema = new Schema(
  {
    questionNumber: { type: String, required: true }, // The number of the question
    statements: [statementSchema], // Array of statements
  },
  {
    timestamps: false, // Automatically manages createdAt and updatedAt fields
    versionKey: false, // Removes the __v field from the schema
  },
);

const DiscProfileQuestion = mongoose.model('DiscProfileQuestion', discQuestionSchema);

export default DiscProfileQuestion;
