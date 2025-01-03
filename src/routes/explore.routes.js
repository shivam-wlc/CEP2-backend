// getAllVideos
import express from 'express';
import * as explore from '##/src/controller/explore.controller.js';
import { isAuthenticated, isRouteAllowed } from '##/src/middleware/auth.middleware.js';
const exploreRoute = express.Router();

//  Allowed to All

exploreRoute.route('/getallvideos').get(explore.getAllVideos);
exploreRoute.route('/getmostviewedthumbnails').get(explore.getMostViewedThumbnails);

export default exploreRoute;
