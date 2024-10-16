import express from 'express';
import * as payment from '##/src/controller/payment.controller.js';
const paymentRoute = express.Router();

// paymentRoute.route('/createpayment/:userId').post(payment.createPaymentforInterestProfile); // Don't know it's use!
paymentRoute.route('/createpayment/:userId').post(payment.createPayment);
paymentRoute.route('/success').get(payment.successPayment);
paymentRoute.route('/failed').post(payment.createPayment);

export default paymentRoute;
