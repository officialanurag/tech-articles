const axios = require('axios');

let attemptCounter = 0; // To track the attempt number for simulating a scenario

/**
 * Demonstrates implementing a fixed delay retry strategy for HTTP requests using axios.
 * It simulates failures for the initial attempts to illustrate how fixed delay retries
 * can effectively manage transient errors by waiting a predetermined amount of time
 * before each retry attempt, regardless of the number of attempts made.
 *
 * The fixed delay approach ensures that retries are spaced out by a consistent interval,
 * offering a straightforward and predictable method to allow for system recovery or error
 * resolution before the next attempt. This strategy is particularly useful in scenarios
 * where the expected recovery time is consistent.
 *
 * Parameters:
 * - url: The endpoint URL to make the HTTP GET request to.
 * - retries: The number of retry attempts before giving up.
 * - delay: The fixed time in milliseconds to wait before each retry attempt.
 */
const fetchDataWithFixedDelay = async (url, retries, delay) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 3) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}. Waiting ${delay} ms before retrying.`);
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchDataWithFixedDelay(url, retries - 1, delay);
    } else {
      throw new Error('All retries failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchDataWithFixedDelay(url, 4, 1000).catch(console.error);
