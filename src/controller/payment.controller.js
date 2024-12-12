import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import Payment from '##/src/models/payment.model.js';
import config from '##/src/config/config.js';
import Stripe from 'stripe';
const stripe = new Stripe(
  'sk_test_51PBCWbSAamJ9jNQR2vtM69iKJDXXpyP9zc62cJM8FLSY6EtxoPxCj6mMtqLdLne76NYYRhaR3pwYotVwhLUyebkS00aWYlqhoy',
);

import { v4 as uuidv4 } from 'uuid';

const createPaymentforInterestProfile = async (req, res) => {
  try {
    const { assessmentName, transactionID, paymentStatus, currency, amount } = req.body;

    const { userId } = req.params;

    const payment = new Payment({
      userId,
      assessmentName,
      transactionID,
      paymentStatus,
      currency,
      amount,
    });
    await payment.save();

    const [unifiedRecord, interestProfile] = await Promise.all([
      UnifiedRecord.findOne({ userId }),
      InterestProfile.findOne({ userId }),
    ]);

    if (!unifiedRecord) {
      return res.status(404).json({ message: 'Unified record not found' });
    }

    if (!interestProfile) {
      return res.status(404).json({ message: 'Interest profile not found' });
    }

    if (unifiedRecord.interestProfile.isPaid || interestProfile.payment.isPaid) {
      return res.status(400).json({ message: 'Payment already made' });
    }

    const assessmentIdInUnifiedRecord = unifiedRecord.interestProfile.assessmentId.toString();
    const assessmentIdInInterestProfile = interestProfile._id.toString();

    console.log('Assessment ID in Unified Record:', assessmentIdInUnifiedRecord);
    console.log('Assessment ID in Interest Profile:', assessmentIdInInterestProfile);

    if (assessmentIdInUnifiedRecord !== assessmentIdInInterestProfile) {
      return res.status(400).json({ message: 'Assessment ID does not match' });
    }
    unifiedRecord.interestProfile.isPaid = true;
    interestProfile.payment.isPaid = true;

    const answers = interestProfile.answers;

    await Promise.all([unifiedRecord.save(), interestProfile.save()]);

    res.redirect(`${config.domain}/assessment-result1`);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { productName, price } = req.body;
    const { userId } = req.params;
    const currency = 'inr';
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency, // pass the currency here
            product_data: {
              name: productName,
            },
            unit_amount: price * 100, // for stripe INR currency; 100 = 100 paise
          },
          quantity: 1,
        },
      ],
      billing_address_collection: 'required',
      mode: 'payment',
      success_url: `${config.server_api}/api/payment/success?userId=${userId}&product=${productName}&currency=${currency}&price=${price}&token=${req.headers.authorization.split(' ')[1]}`,
      cancel_url: `${config.server_api}/api/payment/failed?userId=${userId}&product=${productName}&price=${price}&token=${req.headers.authorization.split(' ')[1]}`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
};

const successPayment = async (req, res) => {
  try {
    const { product, userId, price, currency } = req.query;
    req.body ??= {};
    req.params.userId = userId;
    req.body.assessmentName = product;
    req.body.transactionID = uuidv4();
    req.body.paymentStatus = 'success';
    req.body.currency = currency;
    req.body.amount = price;

    await createPaymentforInterestProfile(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
};

export { createPaymentforInterestProfile, createPayment, successPayment };
