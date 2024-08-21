import { isAuthenticated } from '##/src/middleware/auth.middleware.js';
import authRoutes from '##/src/routes/auth.routes.js';
import universityRoute from '##/src/routes/university.routes.js';
import profileRoutes from '##/src/routes/profile.routes.js';
import creatorRoute from '##/src/routes/creator.routes.js';
import surveyRoute from '##/src/routes/survey.routes.js';
import onetRoutes from '##/src/routes/onet.routes.js';
import unifiedRecordRoute from '##/src/routes/unifiedRecord.routes.js';
import paymentRoute from '##/src/routes/payment.routes.js';
import adminRoutes from '##/src/routes/admin.routes.js';
import userDetailRoutes from '##/src/routes/userDetails.routes.js';
import commentRoutes from '##/src/routes/comment.routes.js';
import discQuestionRoute from '##/src/routes/discQuestion.routes.js';
import resumeRoutes from '##/src/routes/resume.routes.js';

function routes(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/university', universityRoute);
  app.use('/api/profile', profileRoutes);
  app.use('/api/creator', creatorRoute);
  app.use('/api/survey', isAuthenticated, surveyRoute);
  app.use('/api/onet', isAuthenticated, onetRoutes);
  // app.use('/api/unifiedrecord', isAuthenticated, unifiedRecordRoute);
  app.use('/api/unifiedrecord', unifiedRecordRoute);

  app.use('/api/payment', isAuthenticated, paymentRoute);
  app.use('/api/admin', adminRoutes);
  app.use('/api/user-details', userDetailRoutes);
  app.use('/api/comment', commentRoutes);
  app.use('/api/disc', discQuestionRoute);
  app.use('/api/resume', resumeRoutes);
}

export default routes;
