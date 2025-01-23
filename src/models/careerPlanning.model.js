import mongoose from 'mongoose';

const careerPlanningSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Assuming you have a User model
    },
    careerOfInterest: {
      type: String,
      default: '',
      // required: true,
    },
    educationalOptions: {
      type: String,
      default: '',
      // required: true,
    },
    researchToDo: {
      type: String,
      default: '',
      // required: true,
    },
    skillsToBuild: {
      type: String,
      default: '',
      // required: true,
    },
    topCareerGoals: {
      type: String,
      // required: true,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false, // Disables the `__v` version key field
  },
);

const CareerPlanning = mongoose.model('CareerPlanning', careerPlanningSchema);

export default CareerPlanning;
