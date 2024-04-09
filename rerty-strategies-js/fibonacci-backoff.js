const axios = require('axios');

let attemptCounter = 0; // Tracks the current attempt for simulation

/**
 * Calculates the Fibonacci number for a given index.
 * The Fibonacci sequence is a series of numbers where each number is the sum
 * of the two preceding ones, usually starting with 0 and 1.
 *
 * - index: The position in the Fibonacci sequence.
 */
const calculateFibonacciNumber = (index) => {
    if (index <= 1) return index;
    let previous = 0, current = 1, temp;
    for (let i = 2; i <= index; i++) {
        temp = previous + current;
        previous = current;
        current = temp;
    }
    return current;
};

/**
 * Performs an HTTP GET request using axios with retries based on the Fibonacci backoff strategy.
 * Initially simulates network failures for the first few attempts to illustrate how the application
 * recovers using retry strategies with increasing delays based on the Fibonacci sequence.
 *
 * - url: The URL to send the request to.
 * - retries: The number of retries allowed before failing.
 * - baseDelay: The base delay in milliseconds for the Fibonacci backoff calculation.
 */
const fetchData = async (url, retries, baseDelay) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 2) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}. Waiting for the next attempt.`);
    if (retries > 0) {
      const delay = calculateFibonacciNumber(5 - retries + 1) * baseDelay;
      console.log(`Waiting ${delay} ms before retrying.`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchData(url, retries - 1, baseDelay);
    } else {
      throw new Error('All retries failed after ' + attemptCounter + ' attempts');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 5, 100).catch(console.error);
