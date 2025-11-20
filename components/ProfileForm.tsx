'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import type { Profile } from '../lib/types'

interface ProfileFormProps {
  profile?: Profile
  onSubmit: (profile: Omit<Profile, 'id'>) => void
  onCancel: () => void
  isEditing: boolean
}

export function ProfileForm({ profile, onSubmit, onCancel, isEditing }: ProfileFormProps) {
  const [heading, setHeading] = useState(profile?.heading || '')
  const [description, setDescription] = useState(profile?.description || '')
  const [location, setLocation] = useState(profile?.location || '')
  const [images, setImages] = useState<string[]>(profile?.images || [''])
  const contactNumber = '9784959393' // Fixed contact number

  const handleAddImage = () => {
    if (images.length < 5) {
      setImages([...images, ''])
    }
  }

  const handleRemoveImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index))
    }
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validImages = images.filter(img => img.trim() !== '')
    if (validImages.length === 0) {
      alert('Please add at least one image URL')
      return
    }
    onSubmit({
      heading,
      description,
      location,
      images: validImages,
      contactNumber: '9784959393' as const
    })
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 md:p-8 border border-purple-100 max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <h3 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {isEditing ? 'Edit Profile' : 'Add New Profile'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div>
          <label htmlFor="heading" className="block text-gray-700 mb-2 text-sm sm:text-base">
            Heading *
          </label>
          <input
            id="heading"
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
            placeholder="Enter heading"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2 text-sm sm:text-base">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors resize-none text-sm sm:text-base"
            placeholder="Enter description"
            rows={4}
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-700 mb-2 text-sm sm:text-base">
            Location *
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
            placeholder="Enter location"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Contact Number
          </label>
          <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
            {contactNumber}
          </div>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm">This is a fixed contact number for all profiles</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-gray-700 text-sm sm:text-base">
              Images * (Add 1-5 photos)
            </label>
            {images.length < 5 && (
              <button
                type="button"
                onClick={handleAddImage}
                className="flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {images.map((image, index) => (
              <div key={index} className="flex gap-2 sm:gap-3 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
                    placeholder={`Image URL ${index + 1}`}
                  />
                </div>
                {image && (
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid'
                    }}
                  />
                )}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-2 sm:p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {images.filter(img => img.trim() !== '').length > 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <p className="text-gray-700 mb-3 flex items-center gap-2 text-sm sm:text-base">
                <ImageIcon className="w-4 h-4" />
                Image Preview
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {images.filter(img => img.trim() !== '').map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border-2 border-white shadow-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 sm:gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-3.5 rounded-xl hover:shadow-lg active:scale-95 transition-all text-sm sm:text-base"
          >
            {isEditing ? 'Update' : 'Add Profile'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 sm:py-3.5 rounded-xl hover:bg-gray-200 active:scale-95 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
