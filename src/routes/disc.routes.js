import express from 'express';
import * as disc from '##/src/controller/disc.controller.js';
const discRoute = express.Router();

discRoute.route('/savediscanswers').post(disc.saveDiscAnswers);

export default discRoute;
