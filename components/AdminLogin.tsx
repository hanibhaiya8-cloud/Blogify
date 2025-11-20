'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, X } from 'lucide-react'

interface AdminLoginProps {
  onClose: () => void
}

export function AdminLogin({ onClose }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      // Client-side authentication
      if (username === 'admin' && password === 'admin123') {
        // Store authentication state in localStorage
        localStorage.setItem('isAdminAuthenticated', 'true')
        // Redirect to admin dashboard on successful login
        router.push('/admin')
        router.refresh()
      } else {
        throw new Error('Invalid username or password')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            {/* <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" /> */}
          </div>
          <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Admin Access
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Enter your credentials to manage profiles</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2 text-sm sm:text-base">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm sm:text-base">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-3.5 rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Login to Dashboard
          </button>
        </form>

        <div className="mt-5 sm:mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <p className="text-gray-600 text-center text-sm sm:text-base">
            <span className="text-gray-900">Demo Login:</span><br />
            Username: <span className="text-purple-600">adminhoney</span><br />
            Password: <span className="text-purple-600">adminhoney@6666</span>
          </p>
        </div>
      </div>
    </div>
  )
}
