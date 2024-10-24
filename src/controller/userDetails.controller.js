import User from '##/src/models/user.model.js';
import UserDetails from '##/src/models/userDetails.model.js';

// saving social media data to user database
async function saveSocialMediaLinks(req, res) {
  const { userId } = req.params;
  const { name, link } = req.body;

  try {
    // Check if the link is provided
    if (!link) {
      return res.status(400).json({ message: 'Link is required' });
    }

    const user = await User.findById(userId);
    const userDetails = await UserDetails.findOne({ userId });

    if (!user || !userDetails) {
      return res.status(404).json({ message: 'User or user details not found' });
    }

    // Find the social media entry by name
    const socialMediaLink = userDetails.socialMediaLinks.find((media) => media.name === name);

    if (socialMediaLink) {
      // Update the link if the name matches
      socialMediaLink.link = link;
    } else {
      // Create a new social media link if not found
      userDetails.socialMediaLinks.push({ name, link });
    }

    // Save the updated userDetails
    await userDetails.save();

    res
      .status(200)
      .json({ message: 'Social media link updated or created successfully', userDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSocialMediaLink(req, res) {
  try {
    const { userId } = req.params;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find user details and only return socialMediaLinks
    const userDetails = await UserDetails.findOne({ userId }, 'socialMediaLinks').lean();

    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found' });
    }

    // If no social media links exist
    if (!userDetails.socialMediaLinks || userDetails.socialMediaLinks.length === 0) {
      return res.status(404).json({ message: 'No social media links found for the user' });
    }

    return res.status(200).json({
      message: 'Social media links retrieved successfully',
      socialMediaLinks: userDetails.socialMediaLinks,
    });
  } catch (error) {
    // Handle server or database errors
    return res
      .status(500)
      .json({ message: `Error retrieving social media links: ${error.message}` });
  }
}

export { saveSocialMediaLinks, getSocialMediaLink };
