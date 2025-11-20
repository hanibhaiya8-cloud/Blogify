'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { isAdminAuthenticated } from '../lib/auth';

export function AdminLoginButton() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Client-side authentication
      if (username === 'adminhoney' && password === 'adminhoney@6666') {
        // Store authentication state in localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');
        // Refresh the page to update the UI
        window.location.reload();
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
      setUsername('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    window.location.reload();
  };

  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsAdmin(isAdminAuthenticated());
  }, []);

  if (!isMounted) {
    // Return null during SSR to prevent hydration mismatch
    return null;
  }

  if (isAdmin) {
    return (
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 z-50"
      >
        <span>Logout</span>
      </button>
    );
  }

  return (
    <>
      {/* <button
        onClick={() => setShowLogin(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 z-50"
      >
        <Sparkles className="w-4 h-4" />
        <span>Admin Login</span>
      </button> */}

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
              <p className="text-gray-600">Enter your credentials to access the admin panel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="username" className="block text-gray-700 mb-2 text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2 text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
