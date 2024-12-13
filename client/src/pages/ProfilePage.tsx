import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/api/Api';
import { UserProfile } from '@/components/UserProfile';
import { useToast } from '@/hooks/useToast';

interface Profile {
  email: string;
  name: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching user profile');
      const response = await api.get<Profile>('/api/auth/profile');
      console.log('Profile fetched successfully:', response.data);
      setProfile(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(t('Failed to load profile'));
      toast({
        title: t('Error'),
        description: t('Failed to load profile'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile: { email: string; name: string }) => {
    console.log('handleProfileUpdate called with:', updatedProfile);
    try {
      const response = await api.put<Profile>('/api/auth/profile', updatedProfile);
      console.log('Profile update API response:', response.data);
      setProfile(response.data);
      toast({
        title: t('Success'),
        description: t('Profile updated successfully'),
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      console.error('Error response:', err.response?.data);
      toast({
        title: t('Error'),
        description: err.response?.data?.error || t('Failed to update profile'),
        variant: 'destructive',
      });
      throw err;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">{t('Loading...')}</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!profile) {
    return <div className="flex justify-center items-center h-screen">{t('No profile data found')}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile
        email={profile.email}
        name={profile.name}
        createdAt={profile.createdAt}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}