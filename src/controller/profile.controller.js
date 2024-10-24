import User from '##/src/models/user.model.js';
import UserDetails from '##/src/models/userDetails.model.js';
import { comparePassword, encryptPassword } from '##/src/config/lib/bcrypt.js';
import { checkPassStrength, isValidEmail } from '##/utility/validate.js';
import { uploadToS3 } from '##/src/config/lib/S3.js';

async function getUserProfile(req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateProfile(req, res) {
  try {
    const { userId } = req.params;
    const updateUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    return res.status(200).json({ message: 'User details updated successfully', user: updateUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function updatePassword(req, res) {
  try {
    const { userId } = req.params;
    const { prevPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //compare old password
    const isPreviousPasswordValid = await comparePassword(prevPassword, user.password);

    if (!isPreviousPasswordValid) {
      return res.status(400).json({ message: 'Invalid previous password' });
    }

    if (!checkPassStrength(newPassword)) {
      return res.status(400).json({
        message:
          'Password should be have one uppercase letter, one number, and minimum 6 characters',
      });
    }

    const hashedPassword = await encryptPassword(newPassword);

    user.password = hashedPassword;

    await user.save();
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating user password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function uploadProfilePicture(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('req,', req);

    console.log('req.file:', req.file);

    const { fileLink, ok } = await uploadToS3(req, 'profilePictures');

    if (!ok) {
      return res.status(400).json({ message: 'No file uploaded', ok: false });
    }

    user.profilePicture = fileLink;
    await user.save();

    return res
      .status(200)
      .json({ message: 'Profile picture uploaded successfully', profilePicture: fileLink });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
}

async function uploadSocialMedia(req, res) {}

export { getUserProfile, updateProfile, updatePassword, uploadProfilePicture };
