'use client'

// React import is required for JSX transformation
import  { useState } from 'react'
import { Plus, LayoutGrid } from 'lucide-react'
import type { Profile } from '../lib/types'
import { ProfileForm } from './ProfileForm'
import { ProfileCard } from './ProfileCard'

interface AdminDashboardProps {
  profiles: Profile[]
  onAddProfile: (profile: Omit<Profile, 'id'>) => void
  onEditProfile: (id: string, profile: Omit<Profile, 'id'>) => void
  onDeleteProfile: (id: string) => void
}

export function AdminDashboard({
  profiles,
  onAddProfile,
  onEditProfile,
  onDeleteProfile
}: AdminDashboardProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  const handleAdd = (profile: Omit<Profile, 'id'>) => {
    onAddProfile(profile)
    setShowForm(false)
  }

  const handleEdit = (profile: Omit<Profile, 'id'>) => {
    if (editingProfile) {
      onEditProfile(editingProfile.id, profile)
      setEditingProfile(null)
    }
  }

  const handleEditClick = (profile: Profile) => {
    setEditingProfile(profile)
    setShowForm(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingProfile(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 sm:mb-8 flex-wrap gap-4">
        <div>
          <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h2>
          <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <LayoutGrid className="w-4 h-4" />
            <span>{profiles.length} Total Profiles</span>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProfile(null)
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:shadow-lg active:scale-95 transition-all text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add New Profile</span>
          <span className="sm:hidden">Add Profile</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showForm || editingProfile) && (
        <div className="mb-6 sm:mb-8">
          <ProfileForm
            profile={editingProfile || undefined}
            onSubmit={editingProfile ? handleEdit : handleAdd}
            onCancel={editingProfile ? handleCancelEdit : () => setShowForm(false)}
            isEditing={!!editingProfile}
          />
        </div>
      )}

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
          <p className="text-gray-500 text-sm sm:text-base">No profiles yet. Add your first profile to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => handleEditClick(profile)}
              onDelete={() => {
                if (confirm(`Are you sure you want to delete this profile?`)) {
                  onDeleteProfile(profile.id)
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
