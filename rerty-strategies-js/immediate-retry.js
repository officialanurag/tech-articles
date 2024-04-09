const axios = require('axios');

let attemptCounter = 0; // Tracks the current attempt number to simulate network failures

/**
 * Executes an HTTP GET request using axios, employing an immediate retry strategy upon failure.
 * This approach simulates network failures for the first few attempts, illustrating how the application
 * adapts by retrying the operation immediately without any delay, making it suitable for quickly resolvable
 * transient issues.
 *
 * Immediate retries are used in scenarios where there is a high probability that errors are temporary
 * and can be resolved without introducing a delay, effectively improving the chances of a successful request
 * in environments with fluctuating network stability.
 *
 * - url: The endpoint URL for the HTTP GET request.
 * - retries: The number of allowed retries before giving up.
 */
const fetchData = async (url, retries) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 3) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}.`);
    if (retries > 0) {
      console.log('Retrying immediately.');
      return fetchData(url, retries - 1);
    } else {
      throw new Error(`All retries failed after ${attemptCounter} attempts`);
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 5).catch(console.error);
