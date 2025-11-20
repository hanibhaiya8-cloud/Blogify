'use client';

import { AdminHighProfileForm } from '../../../../components/AdminHighProfileForm';
import { isAdminAuthenticated } from '../../../../lib/auth';

export default function EditHighProfilePage({ params }: { params: { id: string } }) {
  if (typeof window !== 'undefined' && !isAdminAuthenticated()) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <AdminHighProfileForm profileId={params.id} />
    </div>
  );
}
