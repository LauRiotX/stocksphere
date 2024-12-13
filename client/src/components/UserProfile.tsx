import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { updateUserProfile } from '@/api/profile';
import { useToast } from '@/hooks/useToast';

interface UserProfileProps {
  email: string;
  name: string;
  createdAt: string;
  onProfileUpdate?: (updatedProfile: { email: string; name: string }) => void;
}

export function UserProfile({ email, name, createdAt, onProfileUpdate = () => {} }: UserProfileProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedEmail, setEditedEmail] = useState(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called with name:', editedName, 'and email:', editedEmail);
    try {
      const updatedProfile = await updateUserProfile({ name: editedName, email: editedEmail });
      console.log('updateUserProfile response:', updatedProfile);
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
      toast({
        title: t('Profile Updated'),
        description: t('Your profile has been successfully updated.'),
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: t('Update Failed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('User Profile')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name">{t('Name')}</label>
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email">{t('Email')}</label>
                <Input
                  id="email"
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
              </div>
              <Button type="submit">{t('Save')}</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>{t('Cancel')}</Button>
            </div>
          </form>
        ) : (
          <>
            <p><strong>{t('Name')}:</strong> {name}</p>
            <p><strong>{t('Email')}:</strong> {email}</p>
            <p><strong>{t('Member Since')}:</strong> {new Date(createdAt).toLocaleDateString()}</p>
            <Button onClick={() => setIsEditing(true)}>{t('Edit Profile')}</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}