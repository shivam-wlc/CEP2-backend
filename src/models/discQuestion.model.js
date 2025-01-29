import mongoose from 'mongoose';

const { Schema } = mongoose;

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
