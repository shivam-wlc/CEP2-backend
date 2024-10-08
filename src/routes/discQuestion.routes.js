// createQuestion
import express from 'express';
import * as discQuestion from '##/src/controller/discQuestion.controller.js';
const discQuestionRoute = express.Router();

discQuestionRoute.route('/createquestion').post(discQuestion.createQuestion);
discQuestionRoute.route('/getallquestions').get(discQuestion.getAllQuestions);

export default discQuestionRoute;
