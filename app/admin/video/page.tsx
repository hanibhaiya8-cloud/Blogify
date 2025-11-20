'use client';

import { isAdminAuthenticated } from '../../../lib/auth';
import VideoManager from '../../../components/VideoManager';

export default function VideoManagementPage() {
  if (typeof window !== 'undefined' && !isAdminAuthenticated()) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Management</h1>
          <p className="text-gray-600">Upload and manage homepage video and booking settings</p>
        </div>
        <VideoManager />
      </div>
    </div>
  );
}
