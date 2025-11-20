'use client'

// import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, MapPin, User } from 'lucide-react';
import { ImageGallery } from '../../../components/ImageGallery';

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

export default function ProfileDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Get profiles from localStorage or use sample data if not available
    const savedProfiles = localStorage.getItem('blogify_profiles');
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : [];
    
    // Find the profile with the matching ID
    const foundProfile = profiles.find((p: Profile) => p.id === id);
    
    if (foundProfile) {
      setProfile(foundProfile);
    } else {
      // If profile not found, redirect to home
      router.push('/');
    }
    
    setLoading(false);
  }, [id, router]);

  const handleWhatsAppClick = (contactNumber: string) => {
    const cleanNumber = contactNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Profile Details</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Image Gallery */}
            <div className="lg:sticky lg:top-6">
              <div className="relative aspect-square w-full bg-gray-100 rounded-xl overflow-hidden">
                <ImageGallery 
                  images={profile.images} 
                  initialIndex={currentImageIndex}
                  isModal={false}
                />
                
                {/* Gender Badge */}
                <div className={`absolute top-4 right-4 px-4 py-1 rounded-full backdrop-blur-sm shadow-lg text-sm ${
                  profile.gender === 'female' 
                    ? 'bg-pink-500/90 text-white' 
                    : 'bg-blue-500/90 text-white'
                }`}>
                  {profile.gender === 'female' ? 'Female' : 'Male'}
                </div>
              </div>
              
              {/* Thumbnail Navigation */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {profile.images.map((img, index) => (
                  <button 
                    key={index}
                    className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 border-transparent hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${profile.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Profile Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-1" />
                    <span>Age: {profile.age}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{profile.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-medium">Phone:</span> {profile.contactNumber}</p>
                  <p className="text-gray-700"><span className="font-medium">Location:</span> {profile.location}</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleWhatsAppClick(profile.contactNumber)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg font-medium">Contact on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
