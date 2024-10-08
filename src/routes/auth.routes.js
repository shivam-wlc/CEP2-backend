import express from 'express';
import * as auth from '##/src/controller/auth.controller.js';

// eslint-disable-next-line new-cap
const authRoutes = express.Router();

authRoutes.route('/signup').post(auth.signup);
authRoutes.route('/login').post(auth.login);
authRoutes.route('/forget').post(auth.forgetPassword);
authRoutes.route('/verifypassword').post(auth.verifyEmailLinkAndUpdate);
//new
authRoutes.route('/verify-email').post(auth.verifyEmailAndUpdateStatus);
export default authRoutes;
