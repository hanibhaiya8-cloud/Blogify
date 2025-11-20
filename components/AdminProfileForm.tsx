'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, Upload } from 'lucide-react';
import { profileApi } from '@/services/api';
import { Profile } from '@/types/profile';

export function AdminProfileForm() {
  const router = useRouter();
  const params = useParams();
  const isEditMode = !!params?.id;

  const [profile, setProfile] = useState<Omit<Profile, '_id' | 'id'>>({ 
    heading: '',
    description: '',
    location: 'Jaipur',
    contactNumber: '7878787878',
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      if (isEditMode && params.id) {
        try {
          setIsLoading(true);
          const existingProfile = await profileApi.getById(params.id as string);
          setProfile({
            ...existingProfile,
            id: existingProfile._id || params.id // For backward compatibility
          });
          if (existingProfile.images?.[0]) {
            setImagePreview(existingProfile.images[0]);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
          setError(`Failed to load profile: ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadProfile();
  }, [isEditMode, params.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onloadstart = () => {
      setIsLoading(true);
      setError('');
    };
    
    reader.onloadend = () => {
      try {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setProfile(prev => ({
          ...prev,
          images: [imageUrl, ...prev.images].slice(0, 5) // Keep max 5 images
        }));
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process the image. Please try another one.');
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading the file. Please try again.');
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
    
    // Reset the input value to allow selecting the same file again if needed
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isEditMode && params.id) {
        await profileApi.update(params.id as string, profile);
      } else {
        await profileApi.create(profile);
      }
      
      // Fetch latest profiles and sync to localStorage for user page consumption
      try {
        const allProfiles = await profileApi.getAll();
        if (typeof window !== 'undefined') {
          localStorage.setItem('blogify_profiles', JSON.stringify(allProfiles));
        }
      } catch (syncErr) {
        console.error('Error syncing profiles after save:', syncErr);
      }

      // Redirect to user page so the new data is visible immediately
      router.push('/user');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...profile.images];
    updatedImages.splice(index, 1);
    setProfile(prev => ({
      ...prev,
      images: updatedImages
    }));
    if (imagePreview === profile.images[index]) {
      setImagePreview(updatedImages[0] || '');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Profile' : 'Add New Profile'}
          </h2>
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close form"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Contact Number Field - Non-editable */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={profile.contactNumber}
                  readOnly
                  className="block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-700 text-sm p-3 sm:p-2.5"
                />
                <p className="mt-1 text-xs text-gray-500">This is a fixed contact number for all profiles</p>
              </div>
            </div>
            {/* Left Column - Image Upload */}
            <div className="space-y-3">
              <label className="block text-gray-700 text-sm sm:text-base font-medium">
                Profile Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 sm:p-4 text-center">
                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative w-full aspect-square sm:aspect-video">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {profile.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className={`w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg cursor-pointer transition-all ${
                              img === imagePreview ? 'ring-2 ring-purple-500' : 'opacity-70 hover:opacity-100'
                            }`}
                            onClick={() => setImagePreview(img)}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 sm:py-8">
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-500 mb-2">Drag & drop an image here, or click to select</p>
                    <p className="text-xs text-gray-400">Supports JPG, PNG (max 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block mt-3 sm:mt-4 bg-purple-600 text-white text-sm sm:text-base px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium hover:bg-purple-700 cursor-pointer transition-colors active:scale-95"
                >
                  Upload Image
                </label>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="heading" className="block text-sm sm:text-base text-gray-700 font-medium mb-1 sm:mb-2">
                  Name
                </label>
                <input
                  id="heading"
                  type="text"
                  value={profile.heading}
                  onChange={(e) => setProfile({...profile, heading: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm sm:text-base text-gray-700 font-medium mb-1 sm:mb-2">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  type="tel"
                  value={profile.contactNumber}
                  onChange={(e) => setProfile({...profile, contactNumber: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm sm:text-base text-gray-700 font-medium mb-1 sm:mb-2">
                  Location
                </label>
                <select
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-white"
                  required
                >
                  <option value="Jaipur">Jaipur</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm sm:text-base text-gray-700 font-medium mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => setProfile({...profile, description: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors min-h-[100px] sm:min-h-[120px]"
                  placeholder="Enter description"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              disabled={isLoading || !profile.images.length}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : isEditMode ? (
                'Update Profile'
              ) : (
                'Add Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
