import mongoose from 'mongoose';
import Video from '##/src/models/video.model.js';

async function increaseCount(req, res, field) {
  try {
    const { videoId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }

    // Update the count atomically
    const updateResult = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { [field]: 1 } }, // Increment the specified field
      { new: true }, // Return the updated document
    );

    if (!updateResult) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json({
      message: `${field === 'totalViews' ? 'Views' : 'Shares'} count increased successfully`,
      updatedValue: updateResult[field],
    });
  } catch (error) {
    console.error(`Error increasing ${field} count:`, error.message);
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

// Wrapper functions to handle specific fields
async function increaseViewsCount(req, res) {
  return increaseCount(req, res, 'totalViews');
}

async function increaseSharesCount(req, res) {
  return increaseCount(req, res, 'totalShares');
}

export { increaseViewsCount, increaseSharesCount };