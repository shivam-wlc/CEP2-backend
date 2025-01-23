import express from 'express';
import * as support from '##/src/controller/support.controller.js';

const supportRoutes = express.Router();

supportRoutes.route('/sendAdminSupportEmail').post(support.sendAdminSupportEmail);
supportRoutes.route('/sendStudentSupportEmail').post(support.sendStudentSupportEmail);
supportRoutes.route('/sendTechSupportEmail').post(support.sendTechSupportEmail);

export default supportRoutes;
