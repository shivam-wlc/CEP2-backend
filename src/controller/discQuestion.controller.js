import DiscProfileQuestion from '##/src/models/discQuestion.model.js';

// const createQuestion = async (req, res) => {
//   try {
//     const { questionText, statements } = req.body;

//     // Validate input
//     if (!questionText || !Array.isArray(statements) || statements.length === 0) {
//       return res
//         .status(400)
//         .json({ message: 'Invalid input: questionText and statements are required.' });
//     }

//     // Create new question document
//     const newQuestion = new DiscProfileQuestion({
//       questions: [
//         {
//           questionText: questionText,
//           statements: statements.map((statement) => ({
//             text: statement.text,
//             category: statement.category,
//           })),
//         },
//       ],
//     });

//     // Save to database
//     await newQuestion.save();
//     res.status(201).json({ message: 'Question created successfully' });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: 'Something went wrong, please try again', error: error.message });
//   }
// };

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
    // Fetch all questions
    const questions = await DiscProfileQuestion.find().exec();

    // Get the total count of questions
    const totalQuestions = await DiscProfileQuestion.countDocuments().exec();

    res.status(200).json({
      totalQuestions, // Include the count in the response
      questions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve questions',
      error: error.message,
    });
  }
};

// const getAllQuestions = async (req, res) => {
//   try {
//     // Fetch and sort questions by questionNumber
//     const questions = await DiscProfileQuestion.find().sort({ questionNumber: 1 }).exec();

//     // Get the total count of questions
//     const totalQuestions = await DiscProfileQuestion.countDocuments().exec();

//     res.status(200).json({
//       totalQuestions, // Include the count in the response
//       questions,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Failed to retrieve questions',
//       error: error.message,
//     });
//   }
// };

export { createQuestion, getAllQuestions };
