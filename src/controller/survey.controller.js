import Survey from '##/src/models/survey.model.js';
import User from '##/src/models/user.model.js';
import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import CareerCluster from '##/src/models/careerCluster.model.js';
import careerClustersData from '##/src/utility/json/careerClusters.js';
import SurveyQuestion from '##/src/models/surveyQuestions.model.js';
import surveyQuestionsData from '##/src/utility/json/surevyQuestions.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import * as onetInterestProfiler from '##/src/services/onet/interestProfiler.onet.service.js';

// async function saveSurveyData(req, res) {
//   const { userId } = req.params;
//   const {
//     educationLevel,
//     gradePoints,
//     nextCareerStep,
//     mostAppealingField,
//     preferredLocation,
//     top3thingsForFuture,
//     nationality,
//     selectedPathways,
//   } = req.body;

//   try {
//     // Validate required fields
//     if (!userId) {
//       return res.status(400).json({ message: 'UserId is required' });
//     }
//     if (
//       !educationLevel ||
//       !gradePoints ||
//       !nextCareerStep ||
//       !mostAppealingField ||
//       !preferredLocation ||
//       !top3thingsForFuture ||
//       !nationality ||
//       !selectedPathways
//     ) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Check if the survey already exists for the user
//     let survey = await Survey.findOne({ userId });

//     if (survey) {
//       // Update existing survey
//       survey.educationLevel = educationLevel;
//       survey.gradePoints = gradePoints;
//       survey.nextCareerStep = nextCareerStep;
//       survey.mostAppealingField = mostAppealingField;
//       survey.preferredLocation = preferredLocation;
//       survey.top3thingsForFuture = top3thingsForFuture;
//       survey.nationality = nationality;
//       survey.selectedPathways = selectedPathways;

//       await survey.save();
//     } else {
//       // Create new survey
//       survey = new Survey({
//         userId,
//         educationLevel,
//         gradePoints,
//         nextCareerStep,
//         mostAppealingField,
//         preferredLocation,
//         top3thingsForFuture,
//         nationality,
//         selectedPathways,
//       });

//       await survey.save();
//     }

//     // Find the UnifiedRecord in parallel
//     const userUnifiedRecord = await UnifiedRecord.findOne({ userId });

//     if (!userUnifiedRecord) {
//       return res.status(404).json({ message: 'UnifiedRecord not found' });
//     }

//     // Update UnifiedRecord
//     userUnifiedRecord.survey.isTaken = true;
//     userUnifiedRecord.survey.surveyId = survey._id;
//     await userUnifiedRecord.save();

//     // updating interest profile
//     interestProfileOptimisation(userId, selectedPathways);

//     res.status(201).json({ message: 'Survey data saved successfully!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving survey data', error: error.message });
//   }
// }

async function saveSurveyData(req, res) {
  const { userId } = req.params;
  const {
    educationLevel,
    gradePoints,
    nextCareerStep,
    mostAppealingField,
    preferredLocation,
    top3thingsForFuture,
    nationality,
    selectedPathways,
  } = req.body;

  try {
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }
    if (
      !educationLevel ||
      !gradePoints ||
      !nextCareerStep ||
      !mostAppealingField ||
      !preferredLocation ||
      !top3thingsForFuture ||
      !nationality ||
      !selectedPathways
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Fetch UnifiedRecord
    const userUnifiedRecord = await UnifiedRecord.findOne({ userId });
    if (!userUnifiedRecord) {
      return res.status(404).json({ message: 'UnifiedRecord not found' });
    }

    // Determine the next attempt number
    const currentAttempt = 4 - userUnifiedRecord.combinedPayment.remainingAttempts;

    if (currentAttempt > 3) {
      return res.status(400).json({ message: 'No attempts remaining. Please make a new payment.' });
    }

    // Create new survey for the current attempt
    const survey = new Survey({
      userId,
      attemptNumber: currentAttempt,
      educationLevel,
      gradePoints,
      nextCareerStep,
      mostAppealingField,
      preferredLocation,
      top3thingsForFuture,
      nationality,
      selectedPathways,
    });

    await survey.save();

    // Update UnifiedRecord with new survey
    userUnifiedRecord.survey.push({ surveyId: survey._id, timestamp: new Date(), isTaken: true }); // Store multiple surveys
    userUnifiedRecord.combinedPayment.remainingAttempts -= 1;
    await userUnifiedRecord.save();

    // Optimise interest profile based on selected pathways
    interestProfileOptimisation(userId, selectedPathways, currentAttempt);

    res.status(201).json({
      message: 'Survey data saved successfully!',
      attemptNumber: currentAttempt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving survey data', error: error.message });
  }
}

// Interest Profile Optimisation on the basis of Career Cluster and Pathways

// Interest Profile Optimisation on the basis of Career Cluster and Pathways
async function interestProfileOptimisation(userId, selectedPathways, currentAttempt) {
  try {
    const userInterestProfile = await InterestProfile.findOne({
      userId,
      attemptNumber: currentAttempt,
    });
    if (!userInterestProfile) {
      throw new Error('InterestProfile not found');
    }

    const userAnswers = userInterestProfile.answers;

    // Run promises in parallel for improved performance
    const [careers, results, clustersData] = await Promise.all([
      onetInterestProfiler.resultAndMatchingCareers('careers', userAnswers),
      onetInterestProfiler.resultAndMatchingCareers('results', userAnswers),
      CareerCluster.find(),
    ]);

    // Optimize the creation of occupationData by filtering only required clusters
    const occupationData = clustersData
      .filter((cluster) => selectedPathways.includes(cluster.CareerPathways))
      .map((cluster) => ({
        href: `https://services.onetcenter.org/ws/mnm/careers/${cluster.Code}/`,
        fit: 'Perfect', // Can be customized
        code: cluster.Code,
        title: cluster.Occupation,
      }));

    // Filter careers that match the occupation codes from occupationData
    let finalCareer = occupationData.filter((occupation) =>
      careers.career.some((career) => career.code === occupation.code),
    );

    // If no exact match is found, use all available careers
    if (!finalCareer.length) {
      finalCareer = careers.career;
    } else {
      // Add remaining careers that didn't match initially
      const remaining = careers.career.filter(
        (career) => !finalCareer.some((fc) => fc.code === career.code),
      );
      finalCareer = [...finalCareer, ...remaining];
    }

    // Prioritize "Perfect", then "Great", then "Best" using a fitPriority mapping
    const fitPriority = { Perfect: 1, Great: 2, Best: 3 };
    finalCareer.sort((a, b) => (fitPriority[a.fit] || 4) - (fitPriority[b.fit] || 4));

    // Limit the finalCareer array to 20 items for optimization
    finalCareer = finalCareer.slice(0, 20);
    careers.career = finalCareer;

    // Update user interest profile with optimized careers and results
    userInterestProfile.careers = careers;
    userInterestProfile.results = results;
    await userInterestProfile.save();
  } catch (error) {
    console.error('Error in interestProfileOptimisation:', error);
  }
}

async function getSurveyData(req, res) {
  const { userId } = req.params;
  try {
    // Fetch user and survey data in parallel
    const [user, surveyData] = await Promise.all([
      User.findById(userId),
      Survey.findOne({ userId }),
    ]);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if survey data exists
    if (!surveyData) {
      return res.status(404).json({ message: 'Survey data not found' });
    }

    return res.status(200).json({ surveyData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function getCareerClusterOptions(req, res) {
  try {
    const clusterCount = await CareerCluster.countDocuments().exec();

    if (clusterCount === 0) {
      await CareerCluster.insertMany(careerClustersData);
      console.log('Career clusters inserted');
    }

    // Fetch all career clusters from the database
    const careerClusters = await CareerCluster.find({});

    // Check if there are any career clusters available
    if (careerClusters.length === 0) {
      return res.status(404).json({ message: 'No career clusters found' });
    }

    // Create an object to hold aggregated data
    const aggregatedData = {};

    // Aggregate the data by CareerCluster
    careerClusters.forEach((cluster) => {
      const { CareerPathways, CareerClusters } = cluster;

      // Initialize if not already present
      if (!aggregatedData[CareerClusters]) {
        aggregatedData[CareerClusters] = new Set();
      }

      // Add CareerPathways to the set
      aggregatedData[CareerClusters].add(CareerPathways);
    });

    // Format the final data structure
    const clusterData = Object.entries(aggregatedData).map(([CareerClusters, pathwaysSet]) => ({
      CareerClusters,
      CareerPathways: Array.from(pathwaysSet),
    }));

    return res.status(200).json({ clusterData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function getSurveyQuestions(req, res) {
  try {
    const questionsCount = await SurveyQuestion.countDocuments().exec();

    if (questionsCount === 0) {
      await SurveyQuestion.insertMany(surveyQuestionsData);
      console.log('Survey questions inserted');
    }

    const questions = await SurveyQuestion.find({});

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No survey questions found' });
    }

    return res.status(200).json({ questions });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

export { saveSurveyData, getSurveyData, getCareerClusterOptions, getSurveyQuestions };
