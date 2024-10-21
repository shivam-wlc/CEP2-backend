import User from '##/src/models/user.model.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import UnifiedRecord from '##/src/models/unifiedRecord.model.js';

async function getInterestProfiler(req, res) {
  const { userId } = req.params;

  try {
    // Fetch user and check if it exists
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch unified record and check if it exists
    const unifiedRecord = await UnifiedRecord.findOne({ userId }).lean();
    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    // Fetch interest profile and check if it exists
    const interestProfile = await InterestProfile.findOne({ userId }).lean();
    if (!interestProfile) {
      return res.status(404).json({ message: 'Interest profile not found' });
    }

    // Check if interest profile assessment has been taken
    if (!unifiedRecord.interestProfile.isTaken) {
      return res
        .status(200)
        .json({ message: 'Interest profile not taken, Please take the assessment part A' });
    }

    // Check if disc profile assessment has been taken
    if (!unifiedRecord.discProfile.isTaken) {
      return res
        .status(200)
        .json({ message: 'Disc profile not taken, Please take the assessment part B' });
    }

    // Check payment status and respond accordingly
    if (unifiedRecord.interestProfile.isPaid && unifiedRecord.discProfile.isPaid) {
      return res.status(200).json(interestProfile);
    } else {
      const randomCareers = getRandomCareers(interestProfile.careers.career, 3);
      return res.status(200).json({ ...interestProfile, careers: { career: randomCareers } });
      // return res.status(200).json({ careers: randomCareers });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Function to get random careers
function getRandomCareers(careers, num) {
  if (!careers || careers.length === 0) return [];
  const shuffled = careers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(num, shuffled.length));
}

export { getInterestProfiler };
