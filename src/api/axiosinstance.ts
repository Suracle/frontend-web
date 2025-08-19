import axios from 'axios';

function baseURL() {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8081/api';
  }

}

const axiosInstance = axios.create({
  baseURL: baseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;