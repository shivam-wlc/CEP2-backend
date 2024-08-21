import express from 'express';
import * as admin from '##/src/controller/admin.controller.js';

const adminRoutes = express.Router();

adminRoutes.route('/getgeneralinformation').get(admin.getGeneralInformation);
adminRoutes.route('/all-users-data').get(admin.getAllUsersData);
adminRoutes.route('/all-creators-data').get(admin.getAllCreatorsData);
adminRoutes.route('/updateStatus/:userId').patch(admin.updateActiveStatus);

export default adminRoutes;
