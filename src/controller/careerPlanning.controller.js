import User from '##/src/models/user.model.js';
import CareerPlanning from '##/src/models/careerPlanning.model.js';

// CREATE: Add a new career planning entry
const createCareerPlanning = async (req, res) => {
  try {
    const {
      userId,
      careerOfInterest,
      educationalOptions,
      researchToDo,
      skillsToBuild,
      topCareerGoals,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new career planning entry
    const newCareerPlanning = new CareerPlanning({
      userId,
      careerOfInterest,
      educationalOptions,
      researchToDo,
      skillsToBuild,
      topCareerGoals,
    });

    const savedCareerPlanning = await newCareerPlanning.save();

    return res.status(201).json({
      message: 'Career Planning entry created successfully',
      data: savedCareerPlanning,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// READ: Get career planning by user ID
const getCareerPlanningByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch career planning for a specific user
    const careerPlanning = await CareerPlanning.findOne({ userId });

    if (!careerPlanning) {
      return res.status(404).json({ message: 'Career Planning not found for this user' });
    }

    return res.status(200).json({
      message: 'Career Planning data retrieved successfully',
      data: careerPlanning,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// UPDATE: Update career planning entry by user ID
const updateCareerPlanning = async (req, res) => {
  try {
    const { userId } = req.params;
    const { careerOfInterest, educationalOptions, researchToDo, skillsToBuild, topCareerGoals } =
      req.body;

    const updatedCareerPlanning = await CareerPlanning.findOneAndUpdate(
      { userId },
      { careerOfInterest, educationalOptions, researchToDo, skillsToBuild, topCareerGoals },
      { new: true, runValidators: true }, // Return updated document and validate the fields
    );

    if (!updatedCareerPlanning) {
      return res.status(404).json({ message: 'Career Planning not found for this user' });
    }

    return res.status(200).json({
      message: 'Career Planning updated successfully',
      data: updatedCareerPlanning,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// DELETE: Delete career planning entry by user ID
const deleteCareerPlanning = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedCareerPlanning = await CareerPlanning.findOneAndDelete({ userId });

    if (!deletedCareerPlanning) {
      return res.status(404).json({ message: 'Career Planning not found for this user' });
    }

    return res.status(200).json({
      message: 'Career Planning deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export {
  createCareerPlanning,
  getCareerPlanningByUserId,
  updateCareerPlanning,
  deleteCareerPlanning,
};
