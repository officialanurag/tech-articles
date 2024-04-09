import axios from 'axios';
import axiosRetry from 'axios-retry';

// Configure axios-retry to automatically retry requests
axiosRetry(axios, {
  retries: 3, // Number of retry attempts
  retryDelay: axiosRetry.exponentialDelay, // Use exponential backoff delay between retry attempts
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status === 429, // You can also specify conditions for retrying, such as specific HTTP response statuses
});

// Example of making a request with axios that will be retried upon failure
axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
  