import express from 'express';
import * as rating from '##/src/controller/rating.controller.js';
const ratingRoute = express.Router();

//Allowed to login persons
ratingRoute.route('/ratevideo').post(rating.rateVideo);

export default ratingRoute;