import express from 'express';
import * as userHistory from '##/src/controller/userHistory.controller.js';
const userHistoryRoute = express.Router();

userHistoryRoute.route('/getuserhistory/:userId').get(userHistory.getUserHistory);
userHistoryRoute.route('/studentdashboardanalytics/:userId').get(userHistory.studentDashboardAnalytics);
userHistoryRoute.route('/saveSharingRecord').post(userHistory.saveSharedVideo);
userHistoryRoute.route('/getLikedHistory/:userId').get(userHistory.getUserLikedHistory);
userHistoryRoute.route('/saveNotes').post(userHistory.saveAndUpdateNotes);





export default userHistoryRoute;