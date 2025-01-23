import User from '##/src/models/user.model.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import UnifiedRecord from '##/src/models/unifiedRecord.model.js';

// async function getInterestProfiler(req, res) {
//   const { userId } = req.params;

//   try {
//     // Fetch user and check if it exists
//     const user = await User.findById(userId).lean();
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Fetch unified record and check if it exists
//     const unifiedRecord = await UnifiedRecord.findOne({ userId }).lean();
//     if (!unifiedRecord) {
//       return res.status(404).json({ message: 'Unified record not found' });
//     }

//     console.log('unifiedRecord', unifiedRecord);

//     // Fetch interest profile and check if it exists
//     const interestProfile = await InterestProfile.findOne({ userId, attemptNumber: 1 }).lean();
//     if (!interestProfile) {
//       return res.status(404).json({ message: 'Interest profile not found' });
//     }

//     // Check payment status and respond accordingly
//     if (unifiedRecord.combinedPayment.isPaid) {
//       return res.status(200).json(interestProfile);
//     } else {
//       const randomCareers = getRandomCareers(interestProfile.careers.career, 3);
//       return res.status(200).json({ ...interestProfile, careers: { career: randomCareers } });
//       // return res.status(200).json({ careers: randomCareers });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

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

    // Extract the latest InterestProfile based on timestamp
    const latestInterestProfile = unifiedRecord.interestProfile
      .filter((profile) => profile.isTaken) // Ensure only completed profiles are considered
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]; // Sort and get the latest

    if (!latestInterestProfile) {
      return res.status(404).json({ message: 'No completed InterestProfile found' });
    }

    // Fetch the InterestProfile details from the database
    const interestProfileDetails = await InterestProfile.findById(
      latestInterestProfile.assessmentId,
    ).lean();

    if (!interestProfileDetails) {
      return res.status(404).json({ message: 'Interest profile details not found' });
    }

    // Check payment status and respond accordingly
    if (unifiedRecord.combinedPayment.isPaid) {
      return res.status(200).json(interestProfileDetails);
    } else {
      const randomCareers = getRandomCareers(interestProfileDetails.careers.career, 3);
      return res
        .status(200)
        .json({ ...interestProfileDetails, careers: { career: randomCareers } });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// Function to get random careers
function getRandomCareers(careers, num) {
  if (!careers || careers.length === 0) return [];
  const shuffled = careers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(num, shuffled.length));
}

export { getInterestProfiler };
