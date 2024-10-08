import express from 'express';
import * as onet from '##/src/controller/onet.controller.js';

// eslint-disable-next-line new-cap
const onetRoutes = express.Router();

onetRoutes.route('/browseinfo').get(onet.getOnetInfo);
onetRoutes.route('/searchcareer').post(onet.searchCareerByKeywords);
onetRoutes.route('/getresource').post(onet.getONetResource);
onetRoutes.route('/browseindustry').get(onet.browseIndustry);
onetRoutes.route('/browseindustrycareers').post(onet.browseIndustryCareers);
onetRoutes.route('/getinterestprofilerdata').get(onet.getInterestProfilerData);
onetRoutes.route('/resultmatchingcareers').post(onet.resultAndMatchingCareers);
onetRoutes.route('/browsequestionjobs').post(onet.browseQuestionAndJobs);
onetRoutes.route('/getcareers').post(onet.getCareers);
onetRoutes.route('/careerwithbrightoutlook').get(onet.careerWithBrightOutlook);
onetRoutes.route('/browsecareerwithbrightoutlook').post(onet.browseCareerWithBrightOutlook);
onetRoutes.route('/careerwithapprenticeship').post(onet.careerWithApperenticeship);
onetRoutes.route('/careersortedbyjobpreparation').get(onet.careerSortedByJobPrepration);
onetRoutes
  .route('/browsecareersortedbyjobpreparation')
  .post(onet.browseCareerSortedByJobPrepration);
onetRoutes.route('/careerbycode/:careercode').get(onet.careerByCode);
onetRoutes.route('/getcareerinfo/:careercode/:topic').get(onet.getCareerInfo);
onetRoutes.route('/generateresult/:userId').get(onet.generateResult);

export default onetRoutes;
