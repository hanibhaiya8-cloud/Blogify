'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { isAdminAuthenticated } from '../lib/auth';
import { Trash2, Edit } from 'lucide-react';
import { highProfileCallGirlsApi } from '../services/api';

interface HighProfileCallGirl {
  id: string;
  _id?: string;
  heading: string;
  description: string;
  location: string;
  images: string[];
  contactNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HighProfileCallGirlsListProps {
  showAll?: boolean;
  maxItems?: number;
}

const HighProfileCallGirlsList: React.FC<HighProfileCallGirlsListProps> = ({ showAll = false, maxItems = 8 }) => {
  // All hooks must be called at the top level
  const [profiles, setProfiles] = useState<HighProfileCallGirl[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<HighProfileCallGirl[]>([]);
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
        const data = await highProfileCallGirlsApi.getAll();
        const mapped: HighProfileCallGirl[] = data.map((p: any) => ({
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
        console.error('Error loading high profile call girls:', error);
        // Fallback to localStorage if API fails
        if (typeof window !== 'undefined') {
          const savedProfiles = localStorage.getItem('blogify_high_profile_call_girls');
          if (savedProfiles) {
            const parsedProfiles = JSON.parse(savedProfiles);
            const mapped: HighProfileCallGirl[] = parsedProfiles.map((p: any) => ({
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
          }
        }
      }
    };

    loadProfiles();
  }, [showAll, maxItems]);

  const handleDeleteProfile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this high profile call girl?')) {
      try {
        await highProfileCallGirlsApi.delete(id);
        const updatedProfiles = profiles.filter(profile => (profile.id || profile._id) !== id);
        setProfiles(updatedProfiles);
        setDisplayedProfiles(prev => prev.filter(profile => (profile.id || profile._id) !== id));
        alert('High profile call girl deleted successfully');
      } catch (error) {
        console.error('Failed to delete high profile call girl:', error);
        // Fallback to localStorage if API fails
        if (typeof window !== 'undefined') {
          const savedProfiles = localStorage.getItem('blogify_high_profile_call_girls');
          if (savedProfiles) {
            const parsedProfiles = JSON.parse(savedProfiles);
            const updatedProfiles = parsedProfiles.filter((p: any) => (p.id || p._id) !== id);
            localStorage.setItem('blogify_high_profile_call_girls', JSON.stringify(updatedProfiles));
            
            const updatedState = profiles.filter(profile => (profile.id || profile._id) !== id);
            setProfiles(updatedState);
            setDisplayedProfiles(prev => prev.filter(profile => (profile.id || profile._id) !== id));
          }
        }
        alert('Failed to delete high profile call girl');
      }
    }
  };

  const handleEditProfile = (id: string) => {
    // Check if admin is authenticated
    if (isAdminAuthenticated()) {
      window.location.href = `/admin/edit-high-profile/${id}`;
    } else {
      // If not authenticated, redirect to login page
      window.location.href = '/admin/login';
    }
  };

  const handleAddProfile = () => {
    // Check if admin is authenticated
    if (isAdminAuthenticated()) {
      window.location.href = '/admin/add-high-profile';
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
            <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse h-96"></div>
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
            <span>+</span> Add New High Profile Girl
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
                  {profile.heading || 'High Profile Call Girl'}
                </h3>
                
                {profile.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                    {profile.description}
                  </p>
                )}
                
                {profile.location && (
                  <p className="text-sm text-purple-600 mb-4 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </p>
                )}
                
                <div className="mt-auto flex gap-2">
                  <a 
                    href={`tel:${profile.contactNumber || '9784959393'}`}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
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
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No high profile call girls available yet. Please check back later.</p>
        </div>
      )}
      
      {!showAll && profiles.length > maxItems && (
        <div className="text-center mt-10">
          <Link 
            href="/high-profile-gallery"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all transform hover:scale-105"
          >
            View All High Profile Girls ({profiles.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default HighProfileCallGirlsList;
