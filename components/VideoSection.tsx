'use client'

import { useState, useEffect } from 'react'

interface VideoSettings {
  videoUrl: string
  phoneNumber: string
}

export default function VideoSection() {
  const [settings, setSettings] = useState<VideoSettings>({
    videoUrl: '',
    phoneNumber: '917878787878'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideoSettings()
  }, [])

  const fetchVideoSettings = async () => {
    try {
      const response = await fetch('/api/video')
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching video settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-10 bg-gray-200 h-[400px] md:h-[600px] flex items-center justify-center">
        <div className="text-gray-500">Loading video...</div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-10 group">
      {settings.videoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          controls
          className="w-full h-[400px] md:h-[600px] object-cover"
          poster=""
        >
          <source src={settings.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-[400px] md:h-[600px] bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <div className="text-white text-center">
            <h3 className="text-2xl md:text-4xl font-bold mb-4">Experience Luxury Like Never Before</h3>
            <p className="text-lg md:text-xl">Premium call girl services in Jaipur</p>
          </div>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-10">
        <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">Experience Luxury Like Never Before</h3>
        <p className="text-white/90 text-sm md:text-lg max-w-2xl">
          Premium call girl services in Jaipur with 100% privacy and satisfaction.
        </p>
        <a
          href={`https://wa.me/${settings.phoneNumber}?text=Hello%2C%20I'm%20interested%20in%20booking%20an%20appointment`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg w-fit text-center"
        >
          Book Now
        </a>
      </div>
    </div>
  )
}
