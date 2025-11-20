'use client';

import  { useState, useEffect } from 'react';
import type { Profile } from '@/types/profile';
import Link from 'next/link';
import { isAdminAuthenticated } from '../lib/auth';
import { Trash2, Edit } from 'lucide-react';
import { profileApi } from '@/services/api';

export default function UserProfileList({ showAll = false, maxItems = 8 }: { showAll?: boolean; maxItems?: number }) {
  // All hooks must be called at the top level
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<Profile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Combine all effects into one to maintain hook order
  useEffect(() => {
    setIsMounted(true);
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check admin status
      setIsAdmin(isAdminAuthenticated());
    }

    const loadProfiles = async () => {
      try {
        const data = await profileApi.getAll();
        const mapped: Profile[] = data.map((p: any) => ({
          _id: p._id,
          id: p._id || p.id,
          heading: p.heading,
          description: p.description,
          location: p.location,
          contactNumber: p.contactNumber,
          images: p.images || [],
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }));
        setProfiles(mapped);
        setDisplayedProfiles(showAll ? mapped : mapped.slice(0, maxItems));
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    };

    loadProfiles();
  }, [showAll, maxItems]);

  const handleDeleteProfile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await profileApi.delete(id);
        const updatedProfiles = profiles.filter(profile => (profile.id || profile._id) !== id);
        setProfiles(updatedProfiles);
        setDisplayedProfiles(prev => prev.filter(profile => (profile.id || profile._id) !== id));
        // Show success message
        alert('Profile deleted successfully');
      } catch (error) {
        console.error('Failed to delete profile:', error);
        alert('Failed to delete profile');
      }
    }
  };

  const handleEditProfile = (id: string) => {
    // Check if admin is authenticated
    if (isAdminAuthenticated()) {
      window.location.href = `/admin/edit/${id}`;
    } else {
      // If not authenticated, redirect to login page
      window.location.href = '/admin/login';
    }
  };

  const handleAddProfile = () => {
    // Check if admin is authenticated
    if (isAdminAuthenticated()) {
      window.location.href = '/admin/add';
    } else {
      // If not authenticated, redirect to login page
      window.location.href = '/admin/login';
    }
  };

  // Show loading state during SSR and initial client render
  if (!isMounted) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden h-96 animate-pulse"></div>
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
      
      {displayedProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedProfiles.map((profile) => (
            <div
              key={profile.id || profile._id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-purple-100 relative group"
            >
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProfile(profile.id || (profile._id as string));
                    }}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProfile(profile.id || (profile._id as string));
                    }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Delete Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {profile.images && profile.images.length > 0 ? (
                <img 
                  src={profile.images[0]} 
                  alt={profile.heading} 
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
                  }}
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              
              <div className="p-5 flex flex-col h-[calc(100%-14rem)]">
                <h3 className="text-lg md:text-xl font-bold text-purple-800 mb-2 break-words">
                  {profile.heading || 'Call Girl in Jodhpur'}
                </h3>
                <div className="mb-3">
                  <p className="text-gray-600 text-sm whitespace-normal break-words">
                    {profile.description || 'Professional call girl service available 24/7 in Jodhpur'}
                  </p>
                </div>
                <p className="text-pink-600 font-medium mb-4">{profile.location || 'Jodhpur, India'}</p>
                <div className="mt-auto pt-3">
                  <div className="flex space-x-3">
                    <a 
                      href={`tel:${profile.contactNumber || '9784959393'}`}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call
                    </a>
                    <button 
                      onClick={() => {
                        const cleanNumber = (profile.contactNumber || '9784959393').replace(/\D/g, '');
                        window.open(`https://wa.me/${cleanNumber}`, '_blank');
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.951.952-3.728-.267-.402a9.867 9.867 0 01-1.203-4.581 9.997 9.997 0 0116.015 7.985c-.001.396-.015.78-.03 1.165z"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No profiles available yet. Please check back later.</p>
        </div>
      )}
      
      {!showAll && profiles.length > maxItems && (
        <div className="text-center mt-10">
          <Link 
            href="/gallery"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all transform hover:scale-105"
          >
            View All Profiles ({profiles.length})
          </Link>
        </div>
      )}
    </div>
  );
}
