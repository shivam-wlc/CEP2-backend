import User from '##/src/models/user.model.js';
import UserDetails from '##/src/models/userDetails.model.js';

async function createSocialMediaLink(req, res) {
  const { userId } = req.params;
  const { name, link } = req.body;

  console.log('userId', userId);

  try {
    const user = await User.findById(userId);
    const userDetails = await UserDetails.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a social media link with the given name already exists
    const existingLinkIndex = userDetails.socialMediaLinks.findIndex(
      (socialMediaLink) => socialMediaLink.name === name,
    );

    if (existingLinkIndex !== -1) {
      // Update the existing social media link
      userDetails.socialMediaLinks[existingLinkIndex].link = link;
    } else {
      // Add a new social media link
      userDetails.socialMediaLinks.push({ name, link });
    }

    await userDetails.save();

    res.status(200).json({ message: 'Social media link added successfully', userDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { createSocialMediaLink };
