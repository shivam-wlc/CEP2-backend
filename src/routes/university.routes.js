import express from 'express';
import * as university from '##/src/controller/university.controller.js';
const universityRoute = express.Router();

// university
universityRoute.route('/getuniversitydata').get(university.getUniversityData);

export default universityRoute;
