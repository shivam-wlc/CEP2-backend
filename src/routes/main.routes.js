import { isAuthenticated } from '##/src/middleware/auth.middleware.js';
import authRoutes from '##/src/routes/auth.routes.js';
import profileRoutes from '##/src/routes/profile.routes.js';
import creatorRoute from '##/src/routes/creator.routes.js';
import surveyRoute from '##/src/routes/survey.routes.js';
import onetRoutes from '##/src/routes/onet.routes.js';
import unifiedRecordRoute from '##/src/routes/unifiedRecord.routes.js';
import paymentRoute from '##/src/routes/payment.routes.js';
import adminRoutes from '##/src/routes/admin.routes.js';
import userDetailRoutes from '##/src/routes/userDetails.routes.js';
import discQuestionRoute from '##/src/routes/discQuestion.routes.js';
import resumeRoutes from '##/src/routes/resume.routes.js';
import discRoute from '##/src/routes/disc.routes.js';
import exploreRoute from '##/src/routes/explore.routes.js';
import likeRoute from '##/src/routes/like.routes.js';
import ratingRoute from '##/src/routes/rating.routes.js';
import interestProfileRoute from '##/src/routes/interestProfile.routes.js';
import followersRoute from '##/src/routes/followers.routes.js';
import viewsAndSharesRoute from '##/src/routes/viewsAndShares.routes.js';
import playlistRoute from '##/src/routes/playlist.routes.js';
import userHistoryRoute from '##/src/routes/userHistory.routes.js';
import schoolContactRoute from '##/src/routes/schoolContact.routes.js';
import supportRoutes from '##/src/routes/support.routes.js';
import careerPlanningRoute from '##/src/routes/careerPlanning.routes.js';

function routes(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/creator', creatorRoute);
  // app.use('/api/survey', isAuthenticated, surveyRoute);
  app.use('/api/survey', surveyRoute);

  // app.use('/api/onet', isAuthenticated, onetRoutes);
  app.use('/api/onet', onetRoutes);

  // app.use('/api/unifiedrecord', isAuthenticated, unifiedRecordRoute);
  app.use('/api/unifiedrecord', unifiedRecordRoute);

  app.use('/api/payment', paymentRoute);
  app.use('/api/admin', adminRoutes);
  app.use('/api/user-details', userDetailRoutes);
  app.use('/api/discQuestions', discQuestionRoute);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/disc', discRoute);
  app.use('/api/explore', exploreRoute);
  app.use('/api/like', likeRoute);
  app.use('/api/rating', ratingRoute);
  app.use('/api/interest', interestProfileRoute);
  //folowers
  app.use('/api/followers', followersRoute);
  //views and shares
  app.use('/api/viewsAndShares', viewsAndSharesRoute);
  //playlist
  app.use('/api/playlist', playlistRoute);
  //user history
  app.use('/api/history', userHistoryRoute);

  //school conatct from
  app.use('/api/schoolContact', schoolContactRoute);

  //support
  app.use('/api/support', supportRoutes);

  //career planning
  app.use('/api/careerPlanning', careerPlanningRoute);
}

export default routes;
