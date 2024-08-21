import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
  Logo: {
    type: String,
    required: true,
  },
  'Wiki-Link': {
    type: String,
    required: true,
  },
  Rank: {
    'THE-Rank': String,
    'QS-Rank': String,
    'ARWU-Rank': String,
    'USNWR-Rank': String,
    'World-Rank': String,
  },
  Type: String,
  Established: String,
  Founder: String,
  Accreditation: String,
  Endowment: String,
  President: String,
  Provost: String,
  Students: {
    Total: String,
    Undergraduate: String,
    Postgraduate: String,
  },
  Location: {
    City: String,
    State: String,
    Country: String,
  },
  Campus: String,
  Website: String,
});

// Indexes
universitySchema.index({ Name: 1 }); // Index on Name for fast lookups
universitySchema.index({ Country: 1 }); // Index on Country for filtering by country
universitySchema.index({ 'Rank.World-Rank': 1 }); // Index on World-Rank for sorting/ranking universities

const University = mongoose.model('University', universitySchema);

export default University;
