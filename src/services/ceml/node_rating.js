// const { spawn } = require('child_process');
import { spawn } from 'child_process';
const pythonScriptPath =
  '/Users/shivam/Desktop/Ce-Phase2Backup/ce-phase2-backend/src/services/ceml/rating_DISC.py';

// Replace this with the path to your Python script
// const pythonScriptPath = "../Python/rating_DISC.py";
// const pythonScriptPath = '##/src/services/ceml/rating_DISC.py';
// const pythonScriptPath = '/Users/shivam/Desktop/Ce-Phase2 Backup/ce-phase2-backend/src/services/ceml/rating_DISC.py';
// const userId = '670f5f0f992eec1dcca605bc';

// Function to call the Python script
export function callPythonScript(userId, currentAttempt) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [pythonScriptPath, userId, currentAttempt]);

    let output = '';
    let errorOutput = '';

    // Collect Python script output
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Collect error messages
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
      }
    });
  });
}

// // Call the function
// callPythonScript(userId)
//   .then((output) => {
//     console.log('Python script output:', output);
//   })
//   .catch((error) => {
//     console.error('Error running Python script:', error.message);
//   });
