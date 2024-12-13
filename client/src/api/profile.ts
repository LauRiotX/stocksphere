import api from './Api';

interface UserProfile {
  email: string;
  name: string;
  createdAt: string;
}

export const updateUserProfile = async (data: { name: string; email: string }): Promise<UserProfile> => {
  try {
    console.log('Updating user profile with data:', data);
    const response = await api.put<UserProfile>('/api/auth/profile', data);
    console.log('Profile update API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Profile update failed:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.error || 'Failed to update profile');
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
};