// import express from 'express';
// import * as payment from '##/src/controller/payment.controller.js';
// const paymentRoute = express.Router();

// // paymentRoute.route('/createpayment/:userId').post(payment.createPaymentforInterestProfile); // Don't know it's use!
// // paymentRoute.route('/createpayment/:userId').post(payment.createPayment);
// // paymentRoute.route('/success').get(payment.successPayment);
// // paymentRoute.route('/failed').post(payment.createPayment);

// paymentRoute.route('/createpayment/:userId').post(payment.initiatePayment);
// paymentRoute.route('/webhook').post(payment.webhook);
// // paymentRoute.route('/failed').post(payment.createPayment);

// export default paymentRoute;

import express from 'express';
import * as payment from '##/src/controller/payment.controller.js';
const paymentRoute = express.Router();

paymentRoute.route('/create-checkout-session').post(payment.initiatePayment);
paymentRoute.route('/verify-payment').post(payment.verifyPayment);
paymentRoute.route('/get-payment-status/:userId').get(payment.checkPaymentStatus);

export default paymentRoute;
