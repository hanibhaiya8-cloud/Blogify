'use client';

import React, { useState, useEffect } from 'react';
import { isAdminAuthenticated } from '../lib/auth';
import { Edit, Trash2 } from 'lucide-react';
import { profileApi } from '../services/api';

interface Profile {
  id: string;
  heading: string;
  description: string;
  location: string;
  images: string[];
  contactNumber: string;
}

const GalleryGrid: React.FC = () => {
  // All hooks must be called at the top level
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Admin handlers
  const handleAddProfile = () => {
    // Trigger add profile modal or redirect to add profile page
    window.location.href = '/admin?tab=profiles&action=add';
  };

  const handleEditProfile = (profileId: string) => {
    // Trigger edit profile modal or redirect to edit profile page
    window.location.href = `/admin?tab=profiles&action=edit&id=${profileId}`;
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await profileApi.delete(profileId);
        setProfiles(prev => prev.filter(p => p.id !== profileId));
      } catch (error) {
        console.error('Error deleting profile:', error);
        // Fallback to localStorage if API fails
        if (typeof window !== 'undefined') {
          try {
            const savedProfiles = JSON.parse(localStorage.getItem('blogify_profiles') || '[]');
            const updatedProfiles = savedProfiles.filter((p: Profile) => p.id !== profileId);
            localStorage.setItem('blogify_profiles', JSON.stringify(updatedProfiles));
            setProfiles(updatedProfiles.slice(0, 10));
          } catch (localStorageError) {
            console.error('Error deleting from localStorage:', localStorageError);
          }
        }
      }
    }
  };

  // Combine all effects into one to maintain hook order
  useEffect(() => {
    setIsMounted(true);
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      setIsAdmin(isAdminAuthenticated());
    }

    const loadProfiles = async () => {
      try {
        const data = await profileApi.getAll();
        const mapped: Profile[] = data.map((p: any) => ({
          id: p._id || p.id,
          heading: p.heading,
          description: p.description,
          location: p.location,
          contactNumber: p.contactNumber,
          images: p.images || []
        }));
        setProfiles(mapped.slice(0, 10));
      } catch (error) {
        console.error('Error loading profiles:', error);
        // Fallback to localStorage if API fails
        if (typeof window !== 'undefined') {
          try {
            const savedProfiles = localStorage.getItem('blogify_profiles');
            if (savedProfiles) {
              const parsedProfiles = JSON.parse(savedProfiles);
              setProfiles(parsedProfiles.slice(0, 10));
            }
          } catch (localStorageError) {
            console.error('Error loading from localStorage:', localStorageError);
          }
        }
      }
    };

    loadProfiles();
  }, []);

  // Show loading state during SSR and initial client render
  if (!isMounted) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-square bg-white rounded-2xl shadow-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddProfile}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>+</span> Add New Profile
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <div 
              key={profile.id} 
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-110"
            >
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProfile(profile.id);
                    }}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id);
                    }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              {profile.images?.[0] ? (
              <img 
                src={profile.images[0]} 
                alt={profile.heading} 
                className="w-full h-48 md:h-56 object-cover transition-all duration-500 group-hover:blur-sm group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                }}
              />
            ) : (
              <div className="w-full h-48 md:h-56 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 text-white overflow-hidden">
              <div className="space-y-2 mb-3">
                <h3 className="font-bold text-base md:text-lg leading-tight break-words">
                  {profile.heading || 'Alluring Call Girl in Jodhpur'}
                </h3>
                {profile.description && (
                  <p>
                    {/* {profile.description} */}
                  </p>
                )}
                <p className="text-xs text-pink-300">
                  <span className="whitespace-nowrap">24/7 Premium Service</span>
                  <span> • </span>
                  <span className="whitespace-nowrap">{profile.location || 'Jodhpur'}</span>
                </p>
              </div>
              <a 
                href={`https://wa.me/91${profile.contactNumber || '9784959393'}?text=Hello%2C%20I'm%20interested%20in%20booking%20an%20appointment%20for%20${encodeURIComponent(profile.heading || 'your service')}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm text-center w-full"
                onClick={(e) => e.stopPropagation()}
              >
                Book Now
              </a>
            </div>
          </div>
        ))
      ) : (
        [...Array(10)].map((_, i) => (
          <div key={i} className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-110">
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/034/844/671/small/ai-generated-portrait-of-a-beautiful-woman-in-a-stylish-trendy-fashion-bodycon-dress-free-photo.jpg" 
              alt={`Girl ${i + 1}`} 
              className="w-full h-48 md:h-56 object-cover transition-all duration-500 group-hover:blur-sm group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 text-white">
              <div className="overflow-y-auto max-h-[calc(100%-60px)] pr-2 -mr-2">
                <h3 className="font-bold text-base mb-1">Alluring Call Girl in Jodhpur</h3>
                <p className="text-xs text-gray-200 mb-2">Premium companionship services available 24/7 in your area. Experience luxury and discretion with our professional escorts.</p>
                <p className="text-xs text-pink-300 mb-3">24/7 Premium Service • Jodhpur</p>
              </div>
              <a 
                href="https://wa.me/919784959393?text=Hello%2C%20I'm%20interested%20in%20booking%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm text-center"
              >
                Book Now
              </a>
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default GalleryGrid;