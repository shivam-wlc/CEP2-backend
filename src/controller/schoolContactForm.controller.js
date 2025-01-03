import SchoolContactForm from '##/src/models/schoolContactForm.model.js'; // Adjust the path as needed

const saveContactData = async (req, res) => {
  try {
    const { userId } = req.params;
    const formData = req.body;

    const newContact = new SchoolContactForm({
      ...formData,
      userId,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      message: 'Data saved successfully',
      data: savedContact,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving data',
      error: error.message,
    });
  }
};

const getAllSchoolContactData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
    const searchQuery = req.query.search || ''; // Optional search query

    const skip = (page - 1) * limit;

    // Create a regex for the search query to enable case-insensitive partial matches
    const searchRegex = new RegExp(searchQuery, 'i');

    // Fetch records and total count concurrently for better performance
    const [schoolData, totalRecords] = await Promise.all([
      SchoolContactForm.find({
        $or: [
          { 'contactPerson1.firstName': searchRegex },
          { 'contactPerson1.lastName': searchRegex },
          { 'contactPerson1.email': searchRegex },
          { 'contactPerson2.firstName': searchRegex },
          { 'contactPerson2.lastName': searchRegex },
          { 'contactPerson2.email': searchRegex },
          { 'schoolDetails.schoolName': searchRegex },
          { 'schoolDetails.city': searchRegex },
        ],
      })
        .sort({ createdAt: -1 }) // Sort by creation date (latest first)
        .skip(skip) // Skip records for pagination
        .limit(limit) // Limit the number of records per page
        .lean(), // Convert Mongoose documents to plain JavaScript objects
      SchoolContactForm.countDocuments({
        $or: [
          { 'contactPerson1.firstName': searchRegex },
          { 'contactPerson1.lastName': searchRegex },
          { 'contactPerson1.email': searchRegex },
          { 'contactPerson2.firstName': searchRegex },
          { 'contactPerson2.lastName': searchRegex },
          { 'contactPerson2.email': searchRegex },
          { 'schoolDetails.schoolName': searchRegex },
          { 'schoolDetails.city': searchRegex },
        ],
      }),
    ]);

    return res.status(200).json({
      message: 'School contact data fetched successfully',
      schoolData,
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong, please try again',
      error: error.message,
    });
  }
};

export { saveContactData, getAllSchoolContactData };
