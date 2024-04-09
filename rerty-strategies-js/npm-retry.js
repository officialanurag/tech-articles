const retry = require('retry');
const axios = require('axios'); // Assuming axios is used for HTTP requests

async function fetchData(url) {
  const operation = retry.operation({
    retries: 3, // Maximum amount of retries
    factor: 2, // The exponential factor for delay
    minTimeout: 1000, // The number of milliseconds before starting the first retry
    maxTimeout: 2000, // The maximum number of milliseconds between two retries
  });

  operation.attempt(async currentAttempt => {
    try {
      const response = await axios.get(url);
      console.log('Data:', response.data);
    } catch (error) {
      console.log(`Attempt ${currentAttempt} failed: ${error.message}`);
      // If retry is needed, the operation.retry function returns true
      if (operation.retry(error)) {
        console.log(`Retrying...`);
        return; // Exit the attempt function to wait for the next retry
      }
      // If no more retries are left, or if the error shouldn't be retried, log or handle it
      console.error('Request failed after retries:', error.message);
    }
  });
}

// Example usage
fetchData('https://jsonplaceholder.typicode.com/posts/1');
