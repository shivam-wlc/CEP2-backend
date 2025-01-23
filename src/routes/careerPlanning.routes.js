import express from 'express';
import * as careerPlanning from '##/src/controller/careerPlanning.controller.js';
const careerPlanningRoute = express.Router();

careerPlanningRoute.route('/createcareerplanning').post(careerPlanning.createCareerPlanning);
careerPlanningRoute
  .route('/getcareerplanning/:userId')
  .get(careerPlanning.getCareerPlanningByUserId);
careerPlanningRoute
  .route('/updatecareerplanning/:userId')
  .patch(careerPlanning.updateCareerPlanning);
careerPlanningRoute
  .route('/deletecareerplanning/:userId')
  .delete(careerPlanning.deleteCareerPlanning);

export default careerPlanningRoute;
