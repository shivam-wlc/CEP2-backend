import DiscProfileQuestion from '##/src/models/discQuestion.model.js';
import predefinedQuestions from '##/src/utility/json/discQuestions.js';

const createQuestion = async (req, res) => {
  try {
    const { questionNumber, statements } = req.body;

    // Validate input
    if (!questionNumber || !Array.isArray(statements) || statements.length === 0) {
      return res
        .status(400)
        .json({ message: 'Invalid input: questionNumber and statements are required.' });
    }

    // Create new question document
    const newQuestion = new DiscProfileQuestion({
      questionNumber: questionNumber,
      statements: statements.map((statement) => ({
        statementText: statement.statementText || '',
        category: {
          most: statement.category?.most || '',
          least: statement.category?.least || '',
        },
      })),
    });

    // Save to database
    await newQuestion.save();
    res.status(201).json({ message: 'Question created successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong, please try again', error: error.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    // Check if any questions exist in the database
    const questionCount = await DiscProfileQuestion.countDocuments().exec();

    // If no questions found, insert predefined questions
    if (questionCount === 0) {
      await DiscProfileQuestion.insertMany(predefinedQuestions);
      console.log('Predefined questions inserted.');
    }

    // Fetch all questions
    const questions = await DiscProfileQuestion.find().exec();

    // Sort questions based on questionNumber
    const sortedQuestions = questions.sort((a, b) => {
      return parseInt(a.questionNumber) - parseInt(b.questionNumber);
    });

    // Get the total count of questions after possible insertion
    const totalQuestions = await DiscProfileQuestion.countDocuments().exec();

    res.status(200).json({
      totalQuestions, // Include the count in the response
      questions: sortedQuestions, // Send sorted questions
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve questions',
      error: error.message,
    });
  }
};

export { createQuestion, getAllQuestions };
