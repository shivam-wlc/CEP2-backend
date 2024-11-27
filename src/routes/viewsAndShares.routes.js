import express from 'express';
import * as viewsAndShares from '##/src/controller/viewsAndShares.controller.js';
import { isAuthenticated, isRouteAllowed } from '##/src/middleware/auth.middleware.js';
const viewsAndSharesRoute = express.Router();

viewsAndSharesRoute.route('/increaseviewscount/:videoId').post(viewsAndShares.increaseViewsCount);
viewsAndSharesRoute.route('/increasesharescount/:videoId').post(viewsAndShares.increaseSharesCount);

export default viewsAndSharesRoute;
