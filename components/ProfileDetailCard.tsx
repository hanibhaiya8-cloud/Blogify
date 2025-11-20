'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MessageCircle, MapPin, User, X } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { useRouter } from 'next/navigation';

// Define the Profile type locally since we're having path resolution issues
type Profile = {
  id: string;
  name: string;
  age: string;
  gender: string;
  description: string;
  contactNumber: string;
  location: string;
  images: string[];
};

interface ProfileDetailCardProps {
  profile: Profile;
}

export function ProfileDetailCard({ profile }: ProfileDetailCardProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleWhatsAppClick = useCallback((contactNumber: string) => {
    const cleanNumber = contactNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  }, []);

  const openFullscreenGallery = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeFullscreenGallery = useCallback(() => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateToDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${profile.id}`);
  }, [profile.id, router]);

  // Handle click outside to close modal
  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeFullscreenGallery();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFullscreenGallery();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isGalleryOpen, closeFullscreenGallery]);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group border border-gray-100">
      {/* Preview Image with Gradient Overlay */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
        {profile.images.length > 0 ? (
          <>
            <img
              src={profile.images[0]}
              alt={`${profile.name}'s profile`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <User className="w-16 h-16 text-purple-400" />
          </div>
        )}
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
              <div className="flex items-center text-sm text-gray-200 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.location}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              profile.gender === 'female' 
                ? 'bg-pink-500/90' 
                : 'bg-blue-500/90'
            }`}>
              {profile.gender === 'female' ? '♀ Female' : '♂ Male'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={openFullscreenGallery}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="View fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>

        {/* View Details Button */}
        <button
          onClick={navigateToDetails}
          className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white transition-colors z-10"
        >
          View Details
        </button>
      </div>

      {/* Profile Description */}
      {/* <div className="p-5">
        <p className="text-gray-600 text-sm line-clamp-3 mb-1">{profile.description}</p>
         */}
        {/* <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            onClick={navigateToDetails}
            className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center"
          >
            View full profile
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsAppClick(profile.contactNumber);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message on WhatsApp</span>
          </button>
        </div> */}
      {/* </div> */}

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeFullscreenGallery}>
          <div className="relative w-full max-w-5xl h-full max-h-[90vh] rounded-xl overflow-hidden shadow-2xl" ref={modalRef} onClick={e => e.stopPropagation()}>
            <button
              onClick={closeFullscreenGallery}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>
            <ImageGallery images={profile.images} />
          </div>
        </div>
      )}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div>
            <h3 className="text-gray-900 mb-1">{profile.name}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm sm:text-base">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Age: {profile.age}</span>
            </div>
          </div>
        </div>

        {profile.location && (
          <div className="flex items-center gap-2 text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
            <span>{profile.location}</span>
          </div>
        )}

        <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{profile.description}</p>

        {/* WhatsApp Button */}
        <button
          onClick={() => handleWhatsAppClick(profile.contactNumber)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 sm:py-3.5 rounded-full hover:shadow-lg active:scale-95 transition-all text-sm sm:text-base"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Connect on WhatsApp</span>
        </button>
      </div>
    </div>
  )
}
