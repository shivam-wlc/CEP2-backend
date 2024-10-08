import express from 'express';
import * as resume from '##/src/controller/resume.controller.js';

const resumeRoutes = express.Router();

resumeRoutes.route('/getResume/:userId').get(resume.getResume);
resumeRoutes.route('/updateResume/:userId').patch(resume.updateResume);

export default resumeRoutes;
