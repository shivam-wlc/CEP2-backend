import Resume from '##/src/models/resume.model.js';
import { uploadToS3 } from '##/src/config/lib/S3.js';

async function getResume(req, res) {
  const { userId } = req.params;
  try {
    const resume = await Resume.findOne({ userId }).lean();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    return res.status(200).json(resume);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateResume(req, res) {
  const { userId } = req.params;
  const updateFields = req.body;

  try {
    // Check if updateFields contains any keys (to avoid unnecessary database operations)
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Find the resume by userId and update only the fields provided in req.body
    const updatedResume = await Resume.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    return res.status(200).json(updatedResume);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function saveToStorage(req, res) {
  try {
    // Extract `userId` from request parameters
    const { userId } = req.params;

    // Find the user's resume data
    const resumeData = await Resume.findOne({ userId });

    // Check if the user and resume data exist
    if (!resumeData) {
      return res.status(404).json({ message: 'Resume data not found for the user' });
    }

    // Upload the file to S3
    const { fileLink, ok } = await uploadToS3(req, 'resumes');

    // Check if the file upload was successful
    if (!ok) {
      return res.status(400).json({ message: 'No file uploaded', ok: false });
    }

    // Update the resume link
    // resumeData.resumeLink = fileLink;
    // resumeData.resumeLinks.push(fileLink);
    resumeData.resumeLinks.push({ link: fileLink, userComment: '' });
    await resumeData.save();

    // Respond with success
    return res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeLink: fileLink,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
}

const updateComment = async (req, res) => {
  try {
    const { commentId, userId } = req.params; // Extract comment ID and userId from params
    const { comment } = req.body; // Extract comment from body

    // Validate inputs
    if (!commentId || !userId || !comment) {
      return res
        .status(400)
        .json({ message: 'User ID, Comment ID, and updated comment are required' });
    }

    // Find the resume document by userId
    const resume = await Resume.findOne({ userId });

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found for the provided user ID' });
    }

    // Find the specific comment in the resumeLinks array
    const commentIndex = resume.resumeLinks.findIndex((link) => link._id.toString() === commentId);

    // If the comment does not exist in the resumeLinks array
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found in the specified resume' });
    }

    // Update the userComment field in the found comment
    resume.resumeLinks[commentIndex].userComment = comment;

    // Save the updated resume
    const updatedResume = await resume.save();

    // Return the updated resume data
    return res.status(200).json({
      message: 'Comment updated successfully',
      data: updatedResume,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const updatePurpose = async (req, res) => {
  try {
    const { resumeId, userId } = req.params; // Extract resume ID and userId from params
    const { purpose } = req.body; // Extract purpose from body

    // Validate inputs
    if (!resumeId || !userId || !purpose) {
      return res.status(400).json({
        message: 'User ID, Resume ID, and updated purpose are required',
      });
    }

    // Find the resume document by userId
    const resume = await Resume.findOne({ userId });

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found for the provided user ID' });
    }

    // Find the specific entry in the resumeLinks array
    const entryIndex = resume.resumeLinks.findIndex((link) => link._id.toString() === resumeId);

    // If the entry does not exist in the resumeLinks array
    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Resume entry not found in the specified resume' });
    }

    // Update the purpose field
    resume.resumeLinks[entryIndex].purposeOfResume = purpose;

    // Save the updated resume
    const updatedResume = await resume.save();

    // Return the updated resume data
    return res.status(200).json({
      message: 'Purpose updated successfully',
      data: updatedResume,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { resumeId, userId } = req.params; // Extract resume ID and userId from params

    // Validate inputs
    if (!resumeId || !userId) {
      return res.status(400).json({
        message: 'User ID and Resume ID are required',
      });
    }

    // Find the resume document by userId
    const resume = await Resume.findOne({ userId });

    // Check if resume exists
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found for the provided user ID' });
    }

    // Find the specific entry in the resumeLinks array
    const entryIndex = resume.resumeLinks.findIndex((link) => link._id.toString() === resumeId);

    // If the entry does not exist in the resumeLinks array
    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Resume entry not found in the specified resume' });
    }

    // Remove the specific entry
    resume.resumeLinks.splice(entryIndex, 1);

    // Save the updated resume document
    const updatedResume = await resume.save();

    // Return the updated resume data
    return res.status(200).json({
      message: 'Resume entry deleted successfully',
      data: updatedResume,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export { getResume, updateResume, saveToStorage, updateComment, updatePurpose, deleteResume };
