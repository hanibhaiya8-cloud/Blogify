'use client';

import { AdminProfileForm } from '../../../components/AdminProfileForm';
import { isAdminAuthenticated } from '../../../lib/auth';

export default function AddProfilePage() {
  if (typeof window !== 'undefined' && !isAdminAuthenticated()) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <AdminProfileForm />
    </div>
  );
}
