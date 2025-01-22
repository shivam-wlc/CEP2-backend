import User from '../models/user.model.js';

//Admin Home Page
async function getGeneralInformation(req, res) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalUsers, totalCreators, newUsersLast7Days, maleCount, femaleCount, otherGenderCount] =
      await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' }, role: 'user' }),
        User.countDocuments({ role: { $ne: 'admin' }, role: 'creator' }),
        User.countDocuments({ createdAt: { $gte: sevenDaysAgo }, role: { $ne: 'admin' } }),
        User.countDocuments({ gender: 'male', role: { $ne: 'admin' } }),
        User.countDocuments({ gender: 'female', role: { $ne: 'admin' } }),
        User.countDocuments({ gender: { $nin: ['male', 'female'] }, role: { $ne: 'admin' } }),
      ]);

    return res.status(200).json({
      last7DaysJoinedUsers: newUsersLast7Days,
      totalUsers,
      totalCreators,
      maleCount,
      femaleCount,
      otherGenderCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
      last7DaysJoinedUsers: 0,
      totalUsers: 0,
      totalCreators: 0,
      maleCount: 0,
      femaleCount: 0,
      otherGenderCount: 0,
    });
  }
}

async function getAllUsersData(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Users per page
    const searchQuery = req.query.search || '';

    // Calculate the number of users to skip
    const skip = (page - 1) * limit;

    // Create a regex for the search query
    const searchRegex = new RegExp(searchQuery, 'i');

    // Fetch users and total count concurrently for better performance
    const [users, totalUsers] = await Promise.all([
      User.find({
        role: 'user',
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { mobile: searchRegex },
        ],
      })
        .sort({ createdAt: -1 }) // Sort by date (latest first)
        .skip(skip)
        .limit(limit)
        .select('firstName lastName email mobile gender status profilePicture isEmailVerified')
        .lean(),
      User.countDocuments({
        role: 'user',
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { mobile: searchRegex },
        ],
      }),
    ]);

    return res.status(200).json({
      message: 'Users fetched successfully',
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function getAllCreatorsData(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Users per page
    const searchQuery = req.query.search || '';

    // Calculate the number of users to skip
    const skip = (page - 1) * limit;

    // Create a regex for the search query
    const searchRegex = new RegExp(searchQuery, 'i');

    // Fetch users and total count concurrently for better performance
    const [users, totalUsers] = await Promise.all([
      User.find({
        role: 'creator',
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { mobile: searchRegex },
        ],
      })
        .sort({ createdAt: -1 }) // Sort by date (latest first)
        .skip(skip)
        .limit(limit)
        .select('firstName lastName email mobile gender status profilePicture isEmailVerified')
        .lean(),
      User.countDocuments({
        role: 'creator',
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { mobile: searchRegex },
        ],
      }),
    ]);

    return res.status(200).json({
      message: 'Creators fetched successfully',
      creators: users,
      totalCreators: totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

async function updateActiveStatus(req, res) {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Update the user's status and select specific fields
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      {
        new: true,
        select: 'firstName lastName email mobile gender status profilePicture isEmailVerified',
      }, // Return specific fields
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User status updated successfully', user });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

export { getGeneralInformation, getAllUsersData, updateActiveStatus, getAllCreatorsData };
