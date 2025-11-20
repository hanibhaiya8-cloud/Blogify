'use client'

import { useState, useEffect } from 'react'
import { Edit2, Trash2, MessageCircle, ChevronLeft, ChevronRight, MapPin, Phone } from 'lucide-react'
import type { Profile } from '../lib/types'

interface ProfileCardProps {
  profile: Profile
  onEdit?: () => void
  onDelete?: () => void
  isReadOnly?: boolean
}

export function ProfileCard({ profile, onEdit, onDelete, isReadOnly = false }: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  useEffect(() => {
    // This effect can be used for any client-side initialization if needed
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === profile.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? profile.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group">
      {/* Image Gallery */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
        <img
          src={profile.images[currentImageIndex]}
          alt={`${profile.heading} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Location Badge */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 rounded-full bg-purple-500/90 text-white backdrop-blur-sm shadow-lg text-xs sm:text-sm">
          {profile.location || 'Location'}
        </div>

        {/* Navigation Arrows */}
        {profile.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Dots */}
        {profile.images.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
            {profile.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-4 sm:w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-4 sm:p-5">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.heading}</h3>
          <p className="text-gray-600 text-sm mb-3">{profile.description}</p>
          
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4 text-purple-500" />
            <span>{profile.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 mt-2 text-sm">
            <Phone className="w-4 h-4 text-green-500" />
            <a href={`tel:${profile.contactNumber}`} className="hover:underline">
              {profile.contactNumber}
            </a>
          </div>
        </div>

        <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex gap-2">
          <a
            href={`https://wa.me/${profile.contactNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <a
            href={`tel:${profile.contactNumber}`}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
        
        {!isReadOnly && onEdit && onDelete && (
          <div className="px-4 sm:px-5 pb-4 flex justify-center gap-4">
            <button
              onClick={onEdit}
              className="text-purple-600 hover:text-purple-800 transition-colors"
              aria-label="Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
