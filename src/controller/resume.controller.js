import Resume from '##/src/models/resume.model.js';

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

// async function updateResume(req, res) {
//   const { userId } = req.params;
//   const updateFields = req.body;

//   try {
//     // Find the resume by userId and update only the fields provided in req.body
//     const updatedResume = await Resume.findOneAndUpdate(
//       { userId },
//       { $set: updateFields },
//       { new: true, runValidators: true },
//     );

//     if (!updatedResume) {
//       return res.status(404).json({ message: 'Resume not found' });
//     }

//     return res.status(200).json(updatedResume);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }
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

export { getResume, updateResume };
