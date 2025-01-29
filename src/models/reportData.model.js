import mongoose from 'mongoose';

const userReportdata = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    report: [
      {
        attemptNumber: {
          type: Number,
          default: 0,
        },
        acceptance_of_management_responsibility: {
          type: String,
          default: '',
        },
        basic_character: {
          type: String,
          default: '',
        },
        capability_for_organization_and_planning: {
          type: String,
          default: '',
        },
        decision_making: {
          type: String,
          default: '',
        },
        factors_that_demotivate: {
          type: String,
          default: '',
        },
        factors_that_threaten_self_esteem: {
          type: String,
          default: '',
        },
        how_relates_to_people: {
          type: String,
          default: '',
        },
        learning_style: {
          type: String,
          default: '',
        },
        management_technique: {
          type: String,
          default: '',
        },
        motivational_factors: {
          type: String,
          default: '',
        },
        personality_insight: {
          type: String,
          default: '',
        },
        potential_as_a_team_leader: {
          type: String,
          default: '',
        },
        potential_as_a_team_member: {
          type: String,
          default: '',
        },
        potential_strengths: {
          type: String,
          default: '',
        },
        potential_weaknesses: {
          type: String,
          default: '',
        },
        questioning_method: {
          type: String,
          default: '',
        },
        response_to_authority: {
          type: String,
          default: '',
        },
        response_to_a_sales_environment: {
          type: String,
          default: '',
        },
        response_to_a_technical_environment: {
          type: String,
          default: '',
        },
        time_scale: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ReportData = mongoose.model('ReportData', userReportdata);

export default ReportData;
