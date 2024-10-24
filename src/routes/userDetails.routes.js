import express from 'express';
import * as userDetails from '##/src/controller/userDetails.controller.js';
const userDetailRoutes = express.Router();

userDetailRoutes.route('/creatorsocialmedia/:userId').post(userDetails.saveSocialMediaLinks);
userDetailRoutes.route('/getsocialmedia/:userId').get(userDetails.getSocialMediaLink);

export default userDetailRoutes;
