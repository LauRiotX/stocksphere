import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const backendURL = 'http://localhost:3000';
const api = axios.create({
  baseURL: backendURL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

let accessToken: string | null = null;

// Axios request interceptor: Attach access token to headers
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (!accessToken) {
      accessToken = localStorage.getItem('accessToken');
    }
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Axios response interceptor: Handle 401/403 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<any> => {
    console.error('Response error:', error.message);
    
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if ([401, 403].includes(error.response?.status) && !originalRequest._retry) {
      console.log('Token expired, attempting refresh...');
      originalRequest._retry = true;

      try {
        const { data } = await axios.post<{ accessToken: string }>(`${backendURL}/api/auth/refresh`, {
          refreshToken: localStorage.getItem('refreshToken'),
        });
        
        console.log('Token refresh successful');
        accessToken = data.accessToken;
        localStorage.setItem('accessToken', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        accessToken = null;
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;