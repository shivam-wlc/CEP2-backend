import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import User from '##/src/models/user.model.js';
import DiscProfile from '##/src/models/disc.model.js';

// async function saveDiscAnswers(req, res) {
//   try {
//     const { userId, answers } = req.body;
//     let discProfile = await DiscProfile.findOne({ userId });

//     if (!discProfile) {
//       res.status(404).json({ message: 'Disc profile not found' });
//     } else {
//       discProfile = await DiscProfile.findOneAndUpdate(
//         { userId },
//         { $set: { answers } },
//         { new: true },
//       );
//     }

//     await discProfile.save();

//     const unifiedRecord = await UnifiedRecord.findOne({ userId });
//     if (!unifiedRecord) {
//       res.status(404).json({ message: 'Unified record not found' });
//     } else {
//       unifiedRecord.discProfile.isTaken = true;
//       unifiedRecord.discProfile.assessmentId = discProfile._id;
//       await unifiedRecord.save();
//     }

//   } catch (error) {}
// }

// async function saveDiscAnswers(req, res) {
//   const { userId, answers } = req.body;

//   try {
//     // Concurrently update DiscProfile and UnifiedRecord
//     const [discProfile, unifiedRecord] = await Promise.all([
//       DiscProfile.findOneAndUpdate(
//         { userId },
//         { $set: { answers } },
//         { new: true, upsert: true }, // Upsert to create if not exists
//       )
//         .lean()
//         .exec(), // Use lean for better performance
//       UnifiedRecord.findOneAndUpdate(
//         { userId },
//         {
//           $set: {
//             'discProfile.isTaken': true,
//             'discProfile.assessmentId': discProfile?._id,
//           },
//         },
//         { new: true },
//       )
//         .lean()
//         .exec(), // Use lean for better performance
//     ]);

//     if (!unifiedRecord) {
//       return res.status(404).json({ message: 'Unified record not found' });
//     }

//     return res
//       .status(200)
//       .json({ message: 'Disc profile and unified record updated successfully' });
//   } catch (error) {
//     return res.status(500).json({ message: 'Failed to save disc answers', error: error.message });
//   }
// }

async function saveDiscAnswers(req, res) {
  const { userId, answers } = req.body;

  try {
    if (!userId || !answers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Concurrently update DiscProfile and UnifiedRecord
    // Calculate scores
    const scores = calculateScores(answers);
   

    // Update or create the DiscProfile
    const discProfile = await DiscProfile.findOneAndUpdate(
      { userId },
      { $set: { answers, scores } },
      { new: true, upsert: true }, // Upsert to create if not exists
    )
      .lean()
      .exec(); // Use lean for better performance

    // Update the UnifiedRecord with the discProfile ID
    const unifiedRecord = await UnifiedRecord.findOneAndUpdate(
      { userId },
      {
        $set: {
          'discProfile.isTaken': true,
          'discProfile.assessmentId': discProfile._id,
        },
      },
      { new: true },
    )
      .lean()
      .exec(); // Use lean for better performance

    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    // await User.findByIdAndUpdate(userId, { $set: { 'discProfile.scores': scores } });

    return res
      .status(200)
      .json({ message: 'Disc profile and unified record updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save disc answers', error: error.message });
  }
}

// async function calculateDiscScore(req, res) {}
// function calculateScores(answersArray) {
//   const scores = {
//     most: { D: 0, I: 0, S: 0, C: 0, B: 0 },
//     least: { D: 0, I: 0, S: 0, C: 0, B: 0 },
//   };

//   answersArray.forEach((answerObj) => {
//     answerObj.questionAns.forEach(({ statementAns }) => {
//       if (statementAns.most) {
//         scores.most[statementAns.most] += 1;
//       }

//       if (statementAns.least) {
//         scores.least[statementAns.least] += 1;
//       }
//     });
//   });

//   return scores;
// }

function calculateScores(answersArray) {
  const scores = {
    most: { D: 0, I: 0, S: 0, C: 0, B: 0 },
    least: { D: 0, I: 0, S: 0, C: 0, B: 0 },
    difference: { D: 0, I: 0, S: 0, C: 0, B: 0 },
  };

  // Calculate counts for most and least
  answersArray.forEach((answerObj) => {
    answerObj.questionAns.forEach(({ statementAns }) => {
      if (statementAns.most) {
        scores.most[statementAns.most] += 1;
      }

      if (statementAns.least) {
        scores.least[statementAns.least] += 1;
      }
    });
  });

  // Calculate differences
  Object.keys(scores.most).forEach((category) => {
    scores.difference[category] = scores.most[category] - scores.least[category];
  });

  return scores;
}

export { saveDiscAnswers };
