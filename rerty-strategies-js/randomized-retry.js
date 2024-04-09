const axios = require('axios');

let attemptCounter = 0; // To track the number of attempts and simulate network failures

/**
 * Performs an HTTP GET request using axios with retries that incorporate randomized delays.
 * This strategy simulates network failures for the initial attempts to demonstrate how the application
 * can recover by retrying with random delays between a specified minimum and maximum range.
 * The randomization of retry intervals helps distribute the load and reduce peak pressure on the system.
 *
 * - url: The endpoint URL for the HTTP GET request.
 * - retries: The number of retries before giving up.
 * - minDelay: The minimum delay in milliseconds before retrying.
 * - maxDelay: The maximum delay in milliseconds before retrying.
 */
const fetchData = async (url, retries, minDelay, maxDelay) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 2) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}.`);
    if (retries > 0) {
      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay; // Calculate a random delay
      console.log(`Waiting ${Math.round(randomDelay)} ms before retrying.`);
      await new Promise(resolve => setTimeout(resolve, Math.round(randomDelay)));
      return fetchData(url, retries - 1, minDelay, maxDelay);
    } else {
      throw new Error(`All retries failed after ${attemptCounter} attempts`);
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 3, 500, 1500).catch(console.error);
