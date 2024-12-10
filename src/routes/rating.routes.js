import express from 'express';
import * as rating from '##/src/controller/rating.controller.js';
const ratingRoute = express.Router();

//Allowed to login persons
ratingRoute.route('/ratevideo').post(rating.rateVideo);
ratingRoute.route('/getratingstatus/:videoId/:userId').get(rating.getRatingStatus);

export default ratingRoute;
