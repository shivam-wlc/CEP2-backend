import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeLinks: [
      {
        link: { type: String }, // Resume link
        userComment: { type: String, default: '' }, // Comment for the specific resume
        purposeOfResume: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    personalInfo: {
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      userName: { type: String },
      gender: { type: String },
      birthdate: { type: Date },
      nationality: { type: String },
      telephone: { type: String },
      email: { type: String },
      mobile: { type: String },
      address: { type: String },
      linkedIn: { type: String },
      github: { type: String },
      website: { type: String },
    },
    summary: { type: String }, // Brief summary or objective
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        grade: { type: String }, // GPA or equivalent
        website: { type: String },
      },
    ],
    experience: [
      {
        jobTitle: { type: String },
        company: { type: String },
        location: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        responsibilities: { type: [String] }, // List of responsibilities or achievements
        achievements: { type: String },
      },
    ],
    skills: {
      technical: { type: [String] }, // e.g., Programming languages, frameworks
      soft: { type: [String] }, // e.g., Communication, teamwork
    },
    projects: [
      {
        title: { type: String },
        description: { type: String },
        technologies: { type: [String] },
        startDate: { type: Date },
        endDate: { type: Date },
        link: { type: String }, // Link to the project, if any
      },
    ],
    certifications: [
      {
        name: { type: String },
        institution: { type: String },
        issueDate: { type: Date },
        link: { type: String },
      },
    ],
    languages: [
      {
        // Languages known
        name: { type: String },
        proficiency: { type: String }, // e.g., Fluent, Intermediate
      },
    ],
    hobbies: { type: [String] }, // List of hobbies or interests
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

resumeSchema.index({ userId: 1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
