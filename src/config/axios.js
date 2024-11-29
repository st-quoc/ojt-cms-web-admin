import axios from 'axios';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import { refreshTokenAPI } from '../apis';

const apiURL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  headers: { 'content-type': 'application/json' },
  paramsSerializer: params => queryString.stringify(params),
  baseURL: apiURL,
});

axiosClient.defaults.timeout = 1000 * 60 * 10;

axiosClient.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

let refreshTokenPromise = null;
axiosClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');

      location.href = '/login';
    }

    const originalRequest = error.config;
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        const refreshToken = localStorage.getItem('refreshToken');
        refreshTokenPromise = refreshTokenAPI(refreshToken)
          .then(res => {
            const { accessToken } = res.data;
            localStorage.setItem('accessToken', accessToken);
            axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
          })
          .catch(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');

            location.href = '/login';
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      return refreshTokenPromise.then(() => {
        return axiosClient(originalRequest);
      });
    }

    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
