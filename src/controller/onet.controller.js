import * as onetBrowseIndustry from '##/src/services/onet/browseIndustry.onet.service.js';
import * as onetCareer from '##/src/services/onet/career.onet.service.js';
import * as onetCareerReport from '##/src/services/onet/careerReport.onet.service.js';
import * as onetInterestProfiler from '##/src/services/onet/interestProfiler.onet.service.js';
import * as onet from '##/src/services/onet/onet.service.js';
import User from '##/src/models/user.model.js';
import Survey from '##/src/models/survey.model.js';
import CareerCluster from '##/src/models/careerCluster.model.js';
import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
// import InterestProfile from '##/src/models/interestProfile.model.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import mongoose from 'mongoose';
import ReportData from '##/src/models/reportData.model.js';

// This is the initial phase any user will see for the 1st time
// Reference: https://services.onetcenter.org/reference/mnm
async function getOnetInfo(req, res) {
  try {
    const onetInfo = await onet.getOnetInfo();
    res.status(200).json(onetInfo);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// Search careers by keywords
async function searchCareerByKeywords(req, res) {
  try {
    const { keyword, start, end } = req.body;
    const getResult = await onet.searchCareerByKeywords(keyword, start, end);
    res.status(200).json(getResult);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function getONetResource(req, res) {
  try {
    const { resource } = req.body;
    const resourceDetails = await onet.getONetResource(resource);
    res.status(200).json(resourceDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// --------Browse careers by industries--------//
async function browseIndustry(req, res) {
  try {
    const industries = await onetBrowseIndustry.browseIndustry();
    res.status(200).json(industries);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function browseIndustryCareers(req, res) {
  try {
    const { code, start, end } = req.body;
    const industryCareers = await onetBrowseIndustry.browseIndustryCareers(code, start, end);
    res.status(200).json(industryCareers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// --------Interest profiler--------//
async function getInterestProfilerData(req, res) {
  try {
    const interstProfilerData = await onetInterestProfiler.getInterestProfilerData();
    res.status(200).json(interstProfilerData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function resultAndMatchingCareers(req, res) {
  try {
    const { answers, userId } = req.body;

    const [careers, results, user, survey, clustersData, unifiedData] = await Promise.all([
      onetInterestProfiler.resultAndMatchingCareers('careers', answers),
      onetInterestProfiler.resultAndMatchingCareers('results', answers),
      User.findById(userId),
      Survey.findOne({ userId }),
      CareerCluster.find(),
      UnifiedRecord.findOne({ userId }),
    ]);

    if (!unifiedData) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    // Helper function to filter out empty objects
    function removeEmptyObjects(array, key) {
      return array.filter((item) => item[key] && mongoose.isValidObjectId(item[key]));
    }

    // Clean the arrays in the UnifiedRecord
    unifiedData.interestProfile = removeEmptyObjects(unifiedData.interestProfile, 'assessmentId');
    unifiedData.discProfile = removeEmptyObjects(unifiedData.discProfile, 'assessmentId');
    unifiedData.survey = removeEmptyObjects(unifiedData.survey, 'surveyId');

    // Determine the next attempt number
    const currentAttempt = 4 - unifiedData.combinedPayment.remainingAttempts;

    if (currentAttempt > 3) {
      return res.status(400).json({ message: 'No attempts remaining. Please make a new payment.' });
    }

    // Create a new InterestProfile for the current attempt
    const interestProfile = new InterestProfile({
      userId,
      attemptNumber: currentAttempt,
      answers,
      careers,
      results,
    });

    await interestProfile.save();

    // Update UnifiedRecord with new InterestProfile

    unifiedData.interestProfile.push({
      assessmentId: interestProfile._id,
      timestamp: new Date(),
      isTaken: true,
    });
    // unifiedData.combinedPayment.remainingAttempts -= 1;
    await unifiedData.save();

    res.status(200).json({
      careers,
      results,
      paid: unifiedData.combinedPayment.isPaid,
      attemptNumber: currentAttempt,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function browseQuestionAndJobs(req, res) {
  try {
    const { resource, start, end } = req.body;
    const questionsAndJobs = await onetInterestProfiler.browseQuestionAndJobs(resource, start, end);
    res.status(200).json(questionsAndJobs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// --------Browse careers by filters--------//
async function getCareers(req, res) {
  try {
    const { start, end } = req.body;
    const careers = await onetCareer.getCareers(start, end);
    res.status(200).json(careers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function careerWithBrightOutlook(req, res) {
  try {
    const careers = await onetCareer.careerWithBrightOutlook();
    res.status(200).json(careers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function browseCareerWithBrightOutlook(req, res) {
  try {
    const { categoryCode, start, end } = req.body;
    const careerDetails = await onetCareer.browseCareerWithBrightOutlook(categoryCode, start, end);
    res.status(200).json(careerDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function careerWithApperenticeship(req, res) {
  try {
    const { start, end } = req.body;
    const careerDetails = await onetCareer.careerWithApperenticeship(start, end);
    res.status(200).json(careerDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function careerSortedByJobPrepration(req, res) {
  try {
    const careerDetails = await onetCareer.careerSortedByJobPrepration();
    res.status(200).json(careerDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function browseCareerSortedByJobPrepration(req, res) {
  try {
    const { jobZone, start, end } = req.body;
    const careerDetails = await onetCareer.browseCareerSortedByJobPrepration(jobZone, start, end);
    res.status(200).json(careerDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// --------careers report--------//
async function careerByCode(req, res) {
  try {
    const { careercode } = req.params;
    const careerDetails = await onetCareerReport.careerByCode(careercode);
    res.status(200).json(careerDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function getCareerInfo(req, res) {
  try {
    const { careercode, topic } = req.params;
    // console.log('careercode', careercode, 'topic', topic);
    const careerDetails = await onetCareerReport.getCareerInfo(careercode, topic);
    res.status(200).json(careerDetails);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// async function generateResult(req, res) {
//   try {
//     const { userId } = req.params;
//     const interestProfileData = await InterestProfile.findOne({ userId });

//     // if (interestProfileData.payment.isPaid === false) {
//     //   return res.status(404).json({ message: 'Payment not done' });
//     // }

//     let totalData = [];

//     const careerPromises = interestProfileData.careers.career.map(async (career) => {
//       const { code } = career;
//       const topic = 'report';

//       try {
//         const response = await onetCareerReport.getCareerInfo(code, topic);
//         totalData.push(response);
//       } catch (error) {
//         console.error(`Failed to fetch data for career code ${code}:`, error.message);
//       }
//     });

//     await Promise.all(careerPromises);

//     res.status(200).json({ totalData });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: 'Something went wrong, please try again', error: error.message });
//   }
// }

async function generateResult(req, res) {
  try {
    const { userId } = req.params;

    // Fetch user, report data, and unified record concurrently
    const [user, unifiedRecord] = await Promise.all([
      User.findById(userId, 'firstName lastName'), // Fetch only required fields
      UnifiedRecord.findOne({ userId }),
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Interest profile not found' });
    }

    const fullname = `${user.firstName} ${user.lastName}`;

    // Sort and get the latest assessment ID
    const sortedInterestProfiles = unifiedRecord.interestProfile.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
    const latestAssessmentId = sortedInterestProfiles[0]?.assessmentId?.toString();

    if (!latestAssessmentId) {
      return res.status(404).json({ message: 'No assessment data available' });
    }

    // Fetch interest profile data
    const interestProfileData = await InterestProfile.findById(latestAssessmentId);

    const attemptNumber = interestProfileData?.attemptNumber;

    if (!interestProfileData) {
      return res.status(404).json({ message: 'Interest profile data not found' });
    }

    const careers = interestProfileData?.careers.get('career') || [];

    if (!Array.isArray(careers) || careers.length === 0) {
      return res.status(404).json({ message: 'No careers data available' });
    }

    // Fetch career information concurrently
    const totalData = await Promise.all(
      careers.map(async (career) => {
        try {
          const { code } = career;
          const topic = 'report';
          return await onetCareerReport.getCareerInfo(code, topic);
        } catch (error) {
          console.error(`Failed to fetch data for career code ${career.code}:`, error.message);
          return null; // Return null for failed requests
        }
      }),
    );

    // Filter out any failed results (null values)
    const filteredData = totalData.filter((data) => data !== null);

    const userReportdata = await ReportData.findOne({
      userId,
      'report.attemptNumber': attemptNumber,
    });

    const reportObject = {
      acceptance_of_management_responsibility: '',
      basic_character: '',
      capability_for_organization_and_planning: '',
      decision_making: '',
      factors_that_demotivate: '',
      factors_that_threaten_self_esteem: '',
      how_relates_to_people: '',
      learning_style: '',
      motivational_factors: '',
      personality_insight: '',
      potential_as_a_team_leader: '',
      potential_as_a_team_member: '',
      potential_strengths: '',
      potential_weaknesses: '',
      questioning_method: '',
      response_to_authority: '',
      response_to_a_sales_environment: '',
      response_to_a_technical_environment: '',
      time_scale: '',
      management_technique: '',
    };

    for (let i = 0; i < userReportdata?.report.length; i++) {
      if (userReportdata.report[i].attemptNumber === attemptNumber) {
        if (userReportdata.report[i].acceptance_of_management_responsibility !== '') {
          reportObject.acceptance_of_management_responsibility =
            userReportdata.report[i].acceptance_of_management_responsibility;
        }
        if (userReportdata.report[i].basic_character !== '') {
          reportObject.basic_character = userReportdata.report[i].basic_character;
        }
        if (userReportdata.report[i].capability_for_organization_and_planning !== '') {
          reportObject.capability_for_organization_and_planning =
            userReportdata.report[i].capability_for_organization_and_planning;
        }
        if (userReportdata.report[i].decision_making !== '') {
          reportObject.decision_making = userReportdata.report[i].decision_making;
        }
        if (userReportdata.report[i].factors_that_demotivate !== '') {
          reportObject.factors_that_demotivate = userReportdata.report[i].factors_that_demotivate;
        }
        if (userReportdata.report[i].factors_that_threaten_self_esteem !== '') {
          reportObject.factors_that_threaten_self_esteem =
            userReportdata.report[i].factors_that_threaten_self_esteem;
        }
        if (userReportdata.report[i].how_relates_to_people !== '') {
          reportObject.how_relates_to_people = userReportdata.report[i].how_relates_to_people;
        }
        if (userReportdata.report[i].learning_style !== '') {
          reportObject.learning_style = userReportdata.report[i].learning_style;
        }
        if (userReportdata.report[i].motivational_factors !== '') {
          reportObject.motivational_factors = userReportdata.report[i].motivational_factors;
        }
        if (userReportdata.report[i].personality_insight !== '') {
          reportObject.personality_insight = userReportdata.report[i].personality_insight;
        }
        if (userReportdata.report[i].potential_as_a_team_leader !== '') {
          reportObject.potential_as_a_team_leader =
            userReportdata.report[i].potential_as_a_team_leader;
        }
        if (userReportdata.report[i].potential_as_a_team_member !== '') {
          reportObject.potential_as_a_team_member =
            userReportdata.report[i].potential_as_a_team_member;
        }
        if (userReportdata.report[i].potential_strengths !== '') {
          reportObject.potential_strengths = userReportdata.report[i].potential_strengths;
        }
        if (userReportdata.report[i].potential_weaknesses !== '') {
          reportObject.potential_weaknesses = userReportdata.report[i].potential_weaknesses;
        }
        if (userReportdata.report[i].questioning_method !== '') {
          reportObject.questioning_method = userReportdata.report[i].questioning_method;
        }
        if (userReportdata.report[i].response_to_authority !== '') {
          reportObject.response_to_authority = userReportdata.report[i].response_to_authority;
        }
        if (userReportdata.report[i].response_to_a_sales_environment !== '') {
          reportObject.response_to_a_sales_environment =
            userReportdata.report[i].response_to_a_sales_environment;
        }
        if (userReportdata.report[i].response_to_a_technical_environment !== '') {
          reportObject.response_to_a_technical_environment =
            userReportdata.report[i].response_to_a_technical_environment;
        }
        if (userReportdata.report[i].time_scale !== '') {
          reportObject.time_scale = userReportdata.report[i].time_scale;
        }
        if (userReportdata.report[i].management_technique !== '') {
          reportObject.management_technique = userReportdata.report[i].management_technique;
        }
      }
    }

    res
      .status(200)
      .json({
        totalData: filteredData,
        fullname,
        userReportdata: reportObject,
        interestProfileData,
      });
  } catch (error) {
    console.error('Error in generateResult:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

// --------Browse careers by keywords--------//

export {
  getOnetInfo,
  searchCareerByKeywords,
  getONetResource,
  browseIndustry,
  browseIndustryCareers,
  getInterestProfilerData,
  resultAndMatchingCareers,
  browseQuestionAndJobs,
  getCareers,
  careerWithBrightOutlook,
  browseCareerWithBrightOutlook,
  careerWithApperenticeship,
  careerSortedByJobPrepration,
  browseCareerSortedByJobPrepration,
  careerByCode,
  getCareerInfo,
  generateResult,
};
