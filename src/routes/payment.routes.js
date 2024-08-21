import express from 'express';
import * as payment from '##/src/controller/payment.controller.js';
const paymentRoute = express.Router();

paymentRoute.route('/createpayment/:userId').post(payment.createPaymentforInterestProfile);

export default paymentRoute;
