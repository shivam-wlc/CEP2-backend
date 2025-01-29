import express from 'express';
import * as resume from '##/src/controller/resume.controller.js';
import { upload } from '##/src/config/lib/S3.js';

const resumeRoutes = express.Router();

resumeRoutes.route('/getResume/:userId').get(resume.getResume);
resumeRoutes.route('/updateResume/:userId').patch(resume.updateResume);
resumeRoutes.route('/uploadResume/:userId').post(upload.single('resume'), resume.saveToStorage);
resumeRoutes.route('/updateComment/:commentId/:userId').post(resume.updateComment);
resumeRoutes.route('/updatePurpose/:resumeId/:userId').post(resume.updatePurpose);
resumeRoutes.route('/deleteResume/:resumeId/:userId').delete(resume.deleteResume);

export default resumeRoutes;
