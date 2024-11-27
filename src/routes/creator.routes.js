import express from 'express';
import * as creator from '##/src/controller/creator.controller.js';
import { upload } from '##/src/config/lib/S3.js';
import { isAuthenticated, isRouteAllowed } from '##/src/middleware/auth.middleware.js';
const creatorRoute = express.Router();

// Only Allowed to Original Creator

// video
creatorRoute
  .route('/uploadvideo/:userId')
  .post(upload.single('file'), isAuthenticated, isRouteAllowed(['creator']), creator.uploadVideo);
//thumbnail
creatorRoute
  .route('/uploadthumbnail/:userId')
  .post(
    upload.single('file'),
    isAuthenticated,
    isRouteAllowed(['creator']),
    creator.uploadThumbnail,
  );
creatorRoute
  .route('/uploadyoutube/:userId')
  .post(isAuthenticated, isRouteAllowed(['creator']), creator.uploadYoutubeVideoURL);
creatorRoute
  .route('/updatevideo/:userId/:videoId')
  .post(isAuthenticated, isRouteAllowed(['creator']), creator.updateVideo);
creatorRoute.route('/getauthorvideos/:userId').get(creator.getAllAuthorVideos);
creatorRoute
  .route('/deletevideo/:userId/:videoId')
  .delete(isAuthenticated, isRouteAllowed(['creator']), creator.deleteVideo);

// Allowed All To See Creator Profile
creatorRoute.route('/getcreatorprofile/:userId').get(creator.getCreatorProfile);
creatorRoute.route('/video/:videoId').get(creator.videoDetailById);

export default creatorRoute;
