import mongoose from 'mongoose';

const surveyQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [String], // Array of strings for options
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const SurveyQuestion = mongoose.model('SurveyQuestion', surveyQuestionSchema);

export default SurveyQuestion;
