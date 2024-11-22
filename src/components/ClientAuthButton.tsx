// src/components/ClientAuthButton.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthButton } from './AuthButton';

export function ClientAuthButton() {
  const { username, login, logout, register } = useAuth();
  
  return (
    <AuthButton
      username={username}
      onLogin={login}
      onLogout={logout}
      onRegister={register}
    />
  );
}