import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface UserProfileProps {
  email: string;
  name: string;
  createdAt: string;
}

export function UserProfile({ email, name, createdAt }: UserProfileProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('User Profile')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>{t('Name')}:</strong> {name}</p>
        <p><strong>{t('Email')}:</strong> {email}</p>
        <p><strong>{t('Member Since')}:</strong> {new Date(createdAt).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
}