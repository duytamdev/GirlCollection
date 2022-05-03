import axios from 'axios';
export const API_URL =
  'https://api.tumblr.com/v2/blog/gaixinhchonloc.tumblr.com';
export const API_KEY = 'mZu0jeD7aiC67jE5dIM2bIvj5WNbFNXhj8tWakkchRypuLj5Si';

const axiosInstance = axios.create({
  baseURL: API_URL,
});
axiosInstance.interceptors.response.use(
  res => res.data.response,
  err => Promise.reject(err),
); // callback
export default axiosInstance;
