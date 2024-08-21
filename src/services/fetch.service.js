import chalk from 'chalk';

async function fetchWithError(url, parameters) {
  try {
    const response = await fetch(url, parameters);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Create a custom error object with detailed information
    const errorMessage = `Error fetching data from ${url}: ${error.message}`;
    console.error(chalk.red(errorMessage));

    // Throw the error to be caught by the calling code
    throw new Error(errorMessage);
  }
}

export default fetchWithError;
