import express from 'express';
import * as profile from '##/src/controller/profile.controller.js';
import { upload } from '##/src/config/lib/S3.js';
const profileRoutes = express.Router();

// profile
profileRoutes.route('/userProfile/:userId').get(profile.getUserProfile);
profileRoutes.route('/updateProfile/:userId').patch(profile.updateProfile);
profileRoutes.route('/updatePassword/:userId').patch(profile.updatePassword);
profileRoutes
  .route('/uploadProfilePicture/:userId')
  .post(upload.single('file'), profile.uploadProfilePicture);

export default profileRoutes;
