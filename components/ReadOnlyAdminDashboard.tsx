'use client'

import type { Profile } from '../lib/types'
import { ProfileCard } from './ProfileCard'

interface ReadOnlyAdminDashboardProps {
  profiles: Profile[]
  searchTerm: string
}

export function ReadOnlyAdminDashboard({ profiles, searchTerm }: ReadOnlyAdminDashboardProps) {
  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(profile => 
    profile.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* <div className="mb-6 sm:mb-8">
        <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Services Directory
        </h2>
        <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
          <LayoutGrid className="w-4 h-4" />
          <span>{filteredProfiles.length} {filteredProfiles.length === 1 ? 'Service' : 'Services'} Available</span>
        </div>
      </div> */}

      {/* Services Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="">
          {/* <p className="text-gray-500 text-sm sm:text-base">
            {searchTerm ? 'No services match your search.' : 'No services available at the moment.'}
          </p> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="relative">
              <ProfileCard
                profile={profile}
                onEdit={undefined}
                onDelete={undefined}
                isReadOnly={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
