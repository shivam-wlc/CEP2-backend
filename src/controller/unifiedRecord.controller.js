import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import User from '##/src/models/user.model.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import DiscProfile from '##/src/models/disc.model.js';
import Survey from '##/src/models/survey.model.js';
import Resume from '##/src/models/resume.model.js';
import mongoose from 'mongoose';

async function getUnifiedRecordData(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const unifiedRecordData = await UnifiedRecord.findOne({ userId });

    if (!unifiedRecordData) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    res.status(200).json({ unifiedRecordData });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// admin routes

// async function getAllUnifiedRecordData(req, res) {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const searchQuery = req.query.search || '';

//     // Calculate the number of records to skip
//     const skip = (page - 1) * limit;

//     // Create a regex for the search query
//     const searchRegex = new RegExp(searchQuery, 'i');

//     // First, find matching users based on the search query
//     const matchingUsers = await User.find({
//       $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }],
//     }).select('_id'); // We only need the user IDs

//     const userIds = matchingUsers.map((user) => new mongoose.Types.ObjectId(user._id));

//     // Now, fetch unified records that match the user IDs
//     const [unifiedRecordData, totalRecords] = await Promise.all([
//       UnifiedRecord.find({
//         userId: { $in: userIds },
//       })
//         .populate({
//           path: 'userId',
//           select: 'firstName lastName email', // Select the fields you need
//         })
//         .sort({ createdAt: -1 }) // Sort by date (latest first)
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       UnifiedRecord.countDocuments({
//         userId: { $in: userIds },
//       }),
//     ]);

//     return res.status(200).json({
//       message: 'Unified records fetched successfully',
//       unifiedRecordData,
//       totalRecords,
//       currentPage: page,
//       totalPages: Math.ceil(totalRecords / limit),
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Something went wrong, please try again',
//       error: error.message,
//     });
//   }
// }
async function getAllUnifiedRecordData(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || '';

    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    // Create a regex for the search query
    const searchRegex = new RegExp(searchQuery, 'i');

    // First, find matching users based on the search query and role "user"
    const matchingUsers = await User.find({
      role: 'user', // Filter for users with the role "user"
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }],
    }).select('_id'); // We only need the user IDs

    const userIds = matchingUsers.map((user) => new mongoose.Types.ObjectId(user._id));

    // Now, fetch unified records that match the user IDs
    const [unifiedRecordData, totalRecords] = await Promise.all([
      UnifiedRecord.find({
        userId: { $in: userIds },
      })
        .populate({
          path: 'userId',
          select: 'firstName lastName email', // Select the fields you need
        })
        .sort({ createdAt: -1 }) // Sort by date (latest first)
        .skip(skip)
        .limit(limit)
        .lean(),
      UnifiedRecord.countDocuments({
        userId: { $in: userIds },
      }),
    ]);

    return res.status(200).json({
      message: 'Unified records fetched successfully',
      unifiedRecordData,
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function getUnifiedRecordDataOfUser(req, res) {
  const { unifiedId } = req.params;

  try {
    // Find the unified record
    const unifiedRecord = await UnifiedRecord.findById(unifiedId);

    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    const { userId } = unifiedRecord;
    console.log('Unified id', unifiedId, 'user id', userId);

    // Fetch related data concurrently
    const [user, resume, interestProfile, discProfile, survey] = await Promise.all([
      User.findById(userId).lean(),
      Resume.findOne({ userId }).lean(),
      InterestProfile.findOne({ userId }).lean(),
      DiscProfile.findOne({ userId }).lean(),
      Survey.findOne({ userId }).lean(),
    ]);

    // Combine results into a single response object
    const response = {
      unifiedRecord,
      user,
      resume,
      interestProfile,
      discProfile,
      survey,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function updateResumeStatus(req, res) {
  const { userId } = req.params;
  try {
    const unifiedData = await UnifiedRecord.findOne({ userId });
    if (!unifiedData) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    unifiedData.resume.isCompleted = true;
    await unifiedData.save();
    return res.status(200).json({ message: 'Resume status updated successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

export {
  getUnifiedRecordData,
  getAllUnifiedRecordData,
  getUnifiedRecordDataOfUser,
  updateResumeStatus,
};
