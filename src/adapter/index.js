import axios from 'axios';

const reqtimeout = 60000;
export default axios.create({
  baseURL: 'http://localhost:2345/',
  responseType: 'json',
  timeout: reqtimeout,
});
