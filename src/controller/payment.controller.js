import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import InterestProfile from '##/src/models/interestProfile.model.js';
import Payment from '##/src/models/payment.model.js';

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

    res.status(201).json({ message: 'Payment created successfully', answers });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
};

export { createPaymentforInterestProfile };
