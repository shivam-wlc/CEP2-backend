import express from 'express';
import * as like from '##/src/controller/like.controller.js';
import { isAuthenticated, isRouteAllowed } from '##/src/middleware/auth.middleware.js';
const likeRoute = express.Router();

//  Allowed to Authenticated persons which is login

likeRoute.route('/togglelikevideo').post(like.toggleLikeVideo);
likeRoute.route('/getlikestatus/:videoId/:userId').get(like.getLikeStatus);

export default likeRoute;
