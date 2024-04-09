const axios = require('axios');

let attemptCounter = 0; // Keep track of attempts

/**
 * Attempts to fetch data from a given URL using axios with simulated failures.
 * The function simulates network failures for the first 2 attempts by throwing an error,
 * demonstrating how retry mechanisms can handle transient errors.
 * After the simulated failures, actual axios requests are made.
 * 
 * Parameters:
 * - url: The URL to fetch data from.
 * - retries: The number of retries allowed.
 * - delay: The initial delay before retrying, which doubles with each retry.
 * 
 * The function uses exponential backoff for the delay between retries,
 * effectively handling temporary network issues by giving time for recovery.
 */
const fetchData = async (url, retries, delay) => {
  try {
    attemptCounter++;
    if (attemptCounter <= 2) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}. Waiting ${delay} ms before retrying.`);
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchData(url, retries - 1, delay * 2);
    } else {
      throw new Error('All retries failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 3, 1000).catch(console.error);