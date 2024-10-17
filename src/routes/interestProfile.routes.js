import express from 'express';
import * as interestProfile from '##/src/controller/interestProfile.controller.js';
const interestProfileRoute = express.Router();

interestProfileRoute.route('/getinterestprofile/:userId').get(interestProfile.getInterestProfiler);

export default interestProfileRoute;
