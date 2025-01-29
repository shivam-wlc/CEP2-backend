import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import DiscProfile from '##/src/models/disc.model.js';

async function saveDiscAnswers(req, res) {
  const { userId, answers } = req.body;

  try {
    if (!userId || !answers) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const unifiedRecord = await UnifiedRecord.findOne({ userId });
    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    // Determine the next attempt number
    const currentAttempt = 4 - unifiedRecord.combinedPayment.remainingAttempts;

    if (currentAttempt > 3) {
      return res.status(400).json({ message: 'No attempts remaining. Please make a new payment.' });
    }

    // Calculate scores
    const scores = calculateScores(answers);

    // Create a new DiscProfile for the current attempt
    const discProfile = new DiscProfile({
      userId,
      attemptNumber: currentAttempt,
      answers,
      scores,
    });

    await discProfile.save();

    // Update UnifiedRecord with new DiscProfile
    unifiedRecord.discProfile.push({
      assessmentId: discProfile._id,
      timestamp: new Date(),
      isTaken: true,
    });
    // unifiedRecord.combinedPayment.remainingAttempts -= 1;
    await unifiedRecord.save();

    res.status(200).json({
      message: 'Disc profile and unified record updated successfully',
      attemptNumber: currentAttempt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save disc answers', error: error.message });
  }
}

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
