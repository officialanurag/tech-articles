const axios = require('axios');

let attemptCounter = 0; // Tracks the number of attempts for simulating failures

/**
 * This function demonstrates a linear backoff retry strategy using axios for HTTP requests.
 * It simulates network failures for the initial attempts and then succeeds, showcasing
 * how applications can recover from transient issues with appropriate retry logic.
 *
 * The linear backoff strategy increases the delay between retries by a fixed increment,
 * providing a balanced approach to managing retry intervals and allowing the system
 * some time to recover before the next attempt.
 *
 * Parameters:
 * - url: The URL to fetch data from.
 * - retries: The total number of retries allowed.
 * - delay: The initial delay before the first retry.
 * - increment: The amount by which the delay increases after each retry.
 *
 * On failure, the function waits for the specified delay, then retries the request
 * with an increased delay, based on the linear backoff calculation.
 */
const fetchData = async (url, retries, delay, increment) => {
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
      return fetchData(url, retries - 1, delay + increment, increment);
    } else {
      throw new Error('All retries failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 5, 1000, 2000).catch(console.error);