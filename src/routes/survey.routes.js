import express from 'express';
import * as survey from '##/src/controller/survey.controller.js';
const surveyRoute = express.Router();

surveyRoute.route('/savesurveyform1/:userId').post(survey.saveSurveyData);
surveyRoute.route('/getsurveyform1/:userId').get(survey.getSurveyData);
surveyRoute.route('/getcareerclusteroptions').get(survey.getCareerClusterOptions);
surveyRoute.route('/getsurveyquestions').get(survey.getSurveyQuestions);

export default surveyRoute;
