import mongoose from 'mongoose';

const uniqueIDCounterSchema = new mongoose.Schema(
  {
    yearMonth: {
      type: String,
      required: true,
      unique: true, // Ensuring no duplicate yearMonth
    },
    sequenceNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const UniqueIDCounter = mongoose.model('UniqueIDCounter', uniqueIDCounterSchema);

export default UniqueIDCounter;
