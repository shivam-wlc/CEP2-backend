import config from '##/src/config/config.js';
import { comparePassword, encryptPassword } from '##/src/config/lib/bcrypt.js';
import { jwtVerify, signJwt } from '##/src/config/lib/jwt.js';
import { sendEmail } from '##/src/config/lib/nodemailer.js';
import User from '##/src/models/user.model.js';
import UserDetails from '##/src/models/userDetails.model.js';
import UnifiedRecord from '##/src/models/unifiedRecord.model.js';
import UserHistory from '##/src/models/userHistory.model.js';
import Playlist from '##/src/models/playlist.model.js';
import Resume from '##/src/models/resume.model.js';
import { checkPassStrength, isValidEmail } from '##/utility/validate.js';
import UniqueIDCounter from '##/src/models/uniqueIdCounter.model.js';
import ReportData from '##/src/models/reportData.model.js';
import { v4 as uuidv4 } from 'uuid';

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, role, gender } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email is invalid' });
    }

    if (!checkPassStrength(password)) {
      return res.status(400).json({
        message: 'Password should have one uppercase letter, one number, and minimum 6 characters',
      });
    }

    // Check if user exists
    const isUserExist = await User.findOne({ email }).lean();
    if (isUserExist) {
      return res.status(400).json({ message: 'User already exists, please login' });
    }

    const hashedPassword = await encryptPassword(password);

    let status = role === 'creator' ? 'pending' : 'active';

    // Generate unique_id only for non-creators (users)
    let unique_id = '';
    if (role !== 'creator') {
      // Get the current year and month in YYYYMM format
      const currentYearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
      const MAX_RETRIES = 5;
      let retryCount = 0;
      while (retryCount < MAX_RETRIES) {
        try {
          const counter = await UniqueIDCounter.findOneAndUpdate(
            { yearMonth: currentYearMonth },
            { $inc: { sequenceNumber: 1 } },
            { new: true, upsert: true }, // Create if it doesn't exist
          );

          const sequentialNumber = counter.sequenceNumber;
          unique_id = `${currentYearMonth}${sequentialNumber.toString().padStart(4, '0')}`;

          break; // Break out of the loop on success
        } catch (error) {
          retryCount++;
          if (retryCount === MAX_RETRIES) {
            return res.status(500).json({
              message: 'Failed to generate unique ID',
              error: error.message,
            });
          }
        }
      }
    } else {
      unique_id = uuidv4();
    }

    // Create user document
    const user = new User({
      ...req.body,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      status,
      activeDashboard: role,
      mobile,
      gender,
      unique_id: role !== 'creator' ? unique_id : uuidv4(),
    });

    // Save user
    await user.save();

    // Create userDetails for both users and creators
    const userDetails = new UserDetails({
      userId: user._id,
    });

    await userDetails.save();

    // Skip creation of other records for creators
    if (role !== 'creator') {
      const newResume = new Resume({
        userId: user._id,
        personalInfo: {
          firstName,
          lastName,
          email,
          mobile,
        },
      });

      const newUnifiedRecord = new UnifiedRecord({
        userId: user._id,
        unique_id,
        userDetailsId: userDetails._id,
        interestProfile: { isTaken: false },
        discProfile: { isTaken: false },
        survey: { isTaken: false },
        resume: { isCompleted: false, resumeId: newResume._id },
      });

      const newReportData = new ReportData({
        userId: user._id,
      });

      const newPlaylist = new Playlist({ userId: user._id });
      const userHistory = new UserHistory({ userId: user._id });

      // Save unifiedRecord and playlist for non-creators
      await Promise.all([
        newResume.save(),
        newUnifiedRecord.save(),
        newPlaylist.save(),
        userHistory.save(),
        newReportData.save(),
      ]);
    }

    // Generate token and send email
    const token = signJwt({ email: user.email, id: user._id }, '7d', 'access');
    const verificationLink = `${config.domain.app}/verify-email?token=${token}`;

    const studentHtml = `<body
    style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="text-align: center; color: #333333; margin-bottom: 20px">
        <h2>Thank you for confirming your email address!</h2>
      </div>
      <div style="text-align: center; font-size: 16px; color: #555555">
        <p>
          Thank you for confirming your email address. You are good to go and
          carry on Exploring
        </p>
      </div>
      <div style="text-align: center; margin-top: 30px">
        <a
          href=${verificationLink}
          style="
            background: linear-gradient(
              124.89deg,
              #bf2f75 -3.87%,
              #720361 63.8%
            );
            width: 150px;
            padding: 10px 0;
            font-weight: bold;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 90px;
            display: inline-block;
          "
          >Let's Go</a
        >
        <p><strong>Team CareerExplorer</strong></p>
      </div>
    </div>
  </body>`;

    const counsellorHtml = `<body
     style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="text-align: center; color: #333333; margin-bottom: 20px">
        <h2>Thank you for confirming your email address!</h2>
      </div>
      <div style="text-align: center; font-size: 16px; color: #555555">
        <p>
          Welcome to the CareerExplorer.me community We look forward to your
          contributions
        </p>
      </div>
      <div style="text-align: center; margin-top: 30px">
        <a
         href=${verificationLink}
          style="
            background: linear-gradient(
              124.89deg,
              #bf2f75 -3.87%,
              #720361 63.8%
            );
            width: 150px;
            padding: 10px 0;
            font-weight: bold;
            color: white;
            text-align: center;
            text-decoration: none;
            border-radius: 90px;
            display: inline-block;
          "
          >Let's Go</a
        >
        <p><strong>Team CareerExplorer</strong></p>
      </div>
    </div>
  </body>`;

    const html = user.role === 'creator' ? counsellorHtml : studentHtml;

    await sendEmail(email, 'Email Verification', html);

    return res.status(201).json({ message: 'User Registration Successful', user: { email } });
  } catch (error) {
    return res.status(500).json({ message: 'User Registration Failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    const token = signJwt({ userId: user._id, role: user.role }, '7d', 'access');

    return res.status(200).json({ message: 'Login Successful', token, userId: user._id });
  } catch (error) {
    return res.status(500).json({ message: 'Login Failed', error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    const token = signJwt({ email: user.email, id: user._id }, '20m', 'access');
    // Subject to change accoding to frontend route
    const link = `${config.domain.app}/create-new-password?user=${user._id}&token=${token}`;

    const html = `<div><a href='${link}'>Reset Link</a></div>`;
    await sendEmail(email, 'Reset Password', html);

    return res.status(200).json({ message: 'Reset link sent to your e-mail' });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to send reset password link.: ${error.message}`,
    });
  }
};

const verifyEmailLinkAndUpdate = async (req, res) => {
  try {
    const { userId, token } = req.query;
    const { password, confirmPassword } = req.body;

    const user = await User.findById(userId);

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: 'Password and confirm password fields cannot be empty.',
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password should match.' });
    }

    if (!checkPassStrength(password)) {
      return res.status(400).json({
        message:
          'Password should be have one uppercase letter, one number, and minimum 6 characters',
      });
    }

    const isVerified = jwtVerify(token, 'access');

    if (!isVerified) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Encrypt the new password
    const newPassword = await encryptPassword(password);

    // Update the user's password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully', ok: true });
  } catch (error) {
    return res.status(500).json({ message: `Failed to reset password: ${error.message}` });
  }
};

// new

const verifyEmailAndUpdateStatus = async (req, res) => {
  try {
    const { token } = req.query;
    const { email, id } = jwtVerify(token, 'access');

    if (!email || !id) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update email verification status to true
    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to verify email', error: error.message });
  }
};

export { signup, login, forgetPassword, verifyEmailLinkAndUpdate, verifyEmailAndUpdateStatus };
