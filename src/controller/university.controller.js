import University from '##/src/models/university.model.js';

async function getUniversityData(req, res) {
  const page = parseInt(req.query.page) || 1; // default page number
  const limit = 10; // number of universities per page
  const nameQuery = req.query.name || ''; // name query parameter
  const countryQuery = req.query.country || ''; // country query parameter

  // Create a query object to filter universities based on name and country
  const query = {};

  if (nameQuery) {
    // query.Name = nameQuery; // exact match for name
    query.Name = { $regex: new RegExp(nameQuery, 'i') };
  }
  if (countryQuery) {
    query.Country = countryQuery; // exact match for country
  }

  try {
    const universities = await University.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalUniversities = await University.countDocuments(query);

    res.status(200).json({
      universities,
      currentPage: page,
      totalPages: Math.ceil(totalUniversities / limit),
      totalUniversities,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export { getUniversityData };
