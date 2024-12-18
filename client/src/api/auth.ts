import api from './api';

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    console.log('API: Attempting to refresh access token');
    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    console.log('API: Successfully refreshed access token');
    return accessToken;
  } catch (error) {
    console.error('API: Error refreshing token:', error);
    console.error('API: Error response:', error.response?.data);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    console.log('API: Sending login request to server');
    const { data } = await api.post('/api/auth/login', { email, password });
    console.log('API: Received response from server', data);
    return data;
  } catch (error) {
    console.log('API: Error in login request', error);
    console.log('API: Error response:', error.response?.data);
    return { error: error.response?.data?.message || error.message };
  }
};

export const register = async (email: string, password: string) => {
  try {
    console.log('API: Sending registration request for email:', email);
    const { data } = await api.post('/api/auth/register', { email, password });
    console.log('API: Registration successful', data);
    return data;
  } catch (error) {
    console.log('API: Registration error', error);
    console.log('API: Error response:', error.response?.data);
    throw error; // Make sure to throw the error here
  }
};

// Google OAuth login
export const googleLogin = async (credential: string) => {
  try {
    console.log('API: Sending Google OAuth login request');
    const { data } = await api.post('/api/auth/google', { credential });
    console.log('API: Google OAuth login successful', data);
    return data;
  } catch (error) {
    console.log('API: Google OAuth login error', error);
    console.log('API: Error response:', error.response?.data);
    return { error: error.response?.data?.message || error.message };
  }
};

// Get User Profile
export const getUserProfile = async () => {
  try {
    console.log('API: Fetching user profile');
    const response = await api.get('/api/auth/profile');
    console.log('API: Successfully retrieved user profile', response.data);
    return response.data;
  } catch (error) {
    console.log('API: Error fetching user profile:', error);
    console.log('API: Error response:', error.response?.data);
    throw new Error(error?.response?.data?.message || 'Failed to fetch user profile');
  }
};

// Logout
export const logout = () => {
  console.log('API: Clearing authentication tokens');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('API: Authentication tokens cleared');
};