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
    });

    // Save user, userDetails, unifiedRecord, and userHistory in parallel
    await user.save();

    const userDetails = new UserDetails({
      userId: user._id,
    });

    const newResume = new Resume({
      userId: user._id,
      personalInfo: {
        // Add the colon here
        firstName,
        lastName,
        email,
        mobile,
      },
    });

    await newResume.save();

    const newUnifiedRecord = new UnifiedRecord({
      userId: user._id,
      userDetailsId: userDetails._id,
      interestProfile: { isTaken: false },
      discProfile: { isTaken: false },
      survey: { isTaken: false },
      resume: { isCompleted: false, resumeId: newResume._id },
    });

    const newPlaylist = new Playlist({ userId: user._id });

    const userHistory = new UserHistory({ userId: user._id });

    await Promise.all([
      userDetails.save(),
      newUnifiedRecord.save(),
      userHistory.save(),
      newPlaylist.save(),
    ]);

    // Generate token and send email
    const token = signJwt({ email: user.email, id: user._id }, '7d', 'access');
    const verificationLink = `${config.domain.app}/verify-email?token=${token}`;

    const html = `
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 20px 0">
                <h1 style="font-size: 24px; margin-bottom: 20px">Confirm Your Email Address</h1>
                <p style="font-size: 16px; margin-bottom: 20px">
                  Please click the button below to confirm your email address.
                </p>
                <a href=${verificationLink} style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
                  Confirm Email
                </a>
              </td>
            </tr>
          </table>
        </body>
      `;
    // await sendEmail(email, 'Email Verification', html);

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
    console.log('user', user);

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    const token = signJwt({ email: user.email, id: user._id }, '20m', 'access');
    // Subject to change accoding to frontend route
    const link = `${config.domain.app}/create-new-password?user=${user._id}&token=${token}`;

    const html = `<div><a href='${link}'>Reset Link</a></div>`;
    // await sendEmail(email, 'Reset Password', html);

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
      return res
        .status(400)
        .json({ message: 'Password and confirm password fields cannot be empty.' });
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
