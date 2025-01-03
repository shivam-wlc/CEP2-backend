import express from 'express';
import * as schoolContact from '##/src/controller/schoolContactForm.controller.js';
const schoolContactRoute = express.Router();

schoolContactRoute.route('/saveschoolcontactform/:userId').post(schoolContact.saveContactData);
schoolContactRoute.route('/getschoolcontactform').get(schoolContact.getAllSchoolContactData);

export default schoolContactRoute;
