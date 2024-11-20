'use client';

import { useState } from 'react';

interface AuthButtonProps {
  username: string | null;
  onLogin: (username: string, password: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onRegister: (username: string, password: string) => Promise<void>;
}

export function AuthButton({ username, onLogin, onLogout, onRegister }: AuthButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        await onRegister(formData.username, formData.password);
      } else {
        await onLogin(formData.username, formData.password);
      }
      setIsModalOpen(false);
      setFormData({ username: '', password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await onLogout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (username) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">Welcome, {username}</span>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4 text-white">
              {isRegistering ? 'Create Account' : 'Login'}
            </h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-900 text-red-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-2 border rounded bg-gray-800 text-white border-gray-700"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? (isRegistering ? 'Creating Account...' : 'Logging in...') 
                    : (isRegistering ? 'Register' : 'Login')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  disabled={isLoading}
                  className="text-sm text-blue-500 hover:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegistering ? 'Back to Login' : 'Create Account'}
                </button>
              </div>
            </form>

            <button
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}