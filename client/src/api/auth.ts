import api from './api';

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

// Logout
export const logout = () => {
  console.log('API: Clearing authentication tokens');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('API: Authentication tokens cleared');
};