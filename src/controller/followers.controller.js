import Follower from '##/src/models/followers.model.js';

const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.body;
    const { targetUserId } = req.params; // User to follow/unfollow

    if (userId === targetUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follower.findOne({
      followerId: userId,
      followingId: targetUserId,
    });

    if (existingFollow) {
      // Unfollow user if already following
      await Follower.findByIdAndDelete(existingFollow._id);
      return res.status(200).json({ message: 'User unfollowed successfully.' });
    }

    // Follow user if not already following
    await Follower.create({ followerId: userId, followingId: targetUserId });
    res.status(200).json({ message: 'User followed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const getFollowerCount = async (req, res) => {
  try {
    const { userId } = req.params; // Target user ID

    const count = await Follower.countDocuments({ followingId: userId });
    res.status(200).json({ followerCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const getFollowingCount = async (req, res) => {
  try {
    const { userId } = req.params; // Target user ID

    const count = await Follower.countDocuments({ followerId: userId });
    res.status(200).json({ followingCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const checkIfFollowing = async (req, res) => {
  try {
    const { userId } = req.params; // The logged-in user
    const { targetUserId } = req.params; // Target creator's userId

    // Find if the user is already following the target user
    const followRelationship = await Follower.findOne({
      followerId: userId,
      followingId: targetUserId,
    });

    // If found, the user is following the creator
    if (followRelationship) {
      return res.status(200).json({ isFollowing: true });
    }

    // If no follow relationship is found, the user is not following the creator
    return res.status(200).json({ isFollowing: false });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

export { toggleFollow, getFollowerCount, getFollowingCount, checkIfFollowing };
