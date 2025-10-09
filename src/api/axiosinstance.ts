import axios from 'axios';

function baseURL() {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8081/api';  // 원래 Java 백엔드로 복원
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