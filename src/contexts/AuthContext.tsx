// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  
  const baseUrl = 'http://odin.cs.csubak.edu:8000';

  const login = async (username: string, password: string) => {
    const res = await fetch(`${baseUrl}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await res.json();
    setUsername(data.username);
  };

  const logout = async () => {
    const res = await fetch(`${baseUrl}/logout/`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Logout failed');
    setUsername(null);
  };

  const register = async (username: string, password: string) => {
    const res = await fetch(`${baseUrl}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await res.json();
    setUsername(data.username);
  };

  return (
    <AuthContext.Provider value={{ username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
