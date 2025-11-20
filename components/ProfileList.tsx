'use client'

import { useState, useRef, useEffect } from 'react'
import { ProfileDetailCard } from './ProfileDetailCard'
import type { Profile } from '@/app/lib/types'
import { Filter, Check } from 'lucide-react'

interface ProfileListProps {
  profiles: Profile[]
}

export function ProfileList({ profiles }: ProfileListProps) {
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredProfiles = profiles.filter(profile => 
    selectedGender === 'all' || profile.gender === selectedGender
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div>
      {/* Header Section */}
      {/* <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-gray-900 mb-2">Browse Profiles</h2>
        <p className="text-gray-600 text-sm sm:text-base">{filteredProfiles.length} profiles available</p>
      </div> */}

      {/* Filter with Icon */}
      <div className="flex justify-end mb-6 relative" ref={dropdownRef}>
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2.5 bg-white rounded-full border border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-600 transition-colors shadow-sm"
            aria-label="Filter profiles"
          >
            <Filter className="w-5 h-5" />
          </button>
          
          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="absolute top-12 right-0 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Filter by Gender</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setSelectedGender('all')
                    setIsFilterOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg flex items-center justify-between ${
                    selectedGender === 'all' 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>All Profiles</span>
                  {selectedGender === 'all' && <Check className="w-4 h-4 text-purple-600" />}
                </button>
                
                <button
                  onClick={() => {
                    setSelectedGender('female')
                    setIsFilterOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg flex items-center justify-between mt-1 ${
                    selectedGender === 'female' 
                      ? 'bg-pink-50 text-pink-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>Women Only</span>
                  {selectedGender === 'female' && <Check className="w-4 h-4 text-pink-600" />}
                </button>
                
                <button
                  onClick={() => {
                    setSelectedGender('male')
                    setIsFilterOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg flex items-center justify-between mt-1 ${
                    selectedGender === 'male' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>Men Only</span>
                  {selectedGender === 'male' && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white/60 backdrop-blur-sm rounded-2xl">
          <p className="text-gray-500">No profiles found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProfiles.map((profile) => (
            <ProfileDetailCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  )
}
