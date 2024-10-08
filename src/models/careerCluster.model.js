import mongoose from 'mongoose';

const careerClustersSchema = new mongoose.Schema(
  {
    CareerClusters: {
      type: String,
      required: true,
    },
    CareerPathways: {
      type: String,
      required: true,
    },
    Code: {
      type: String,
      required: true,
    },
    Occupation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

// Indexes
careerClustersSchema.index({ CareerClusters: 1 }); // Index on CareerClusters for fast lookups
careerClustersSchema.index({ CareerPathways: 1 }); // Index on CareerPathways for filtering by career pathways
careerClustersSchema.index({ Code: 1 }); // Index on Code for quick access
careerClustersSchema.index({ Occupation: 1 }); // Index on Occupation for efficient searches

const CareerCluster = mongoose.model('CareerCluster', careerClustersSchema);

export default CareerCluster;
