'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { toast } from 'react-hot-toast'
import { Upload, Video, Phone } from 'lucide-react'

interface VideoSettings {
  videoUrl: string
  phoneNumber: string
}

export default function VideoManager() {
  const [settings, setSettings] = useState<VideoSettings>({
    videoUrl: '',
    phoneNumber: '917878787878'
  })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/video')
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.data)
      } else {
        toast.error('Failed to fetch video settings')
      }
    } catch (error) {
      toast.error('Error fetching video settings')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file')
        return
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video size should be less than 50MB')
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!settings.phoneNumber.trim()) {
      toast.error('Phone number is required')
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      
      if (selectedFile) {
        formData.append('video', selectedFile)
      }
      
      formData.append('phoneNumber', settings.phoneNumber)

      const response = await fetch('/api/video', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Video settings updated successfully!')
        setSettings(data.data)
        setSelectedFile(null)
        
        // Reset file input
        const fileInput = document.getElementById('video-upload') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
      } else {
        toast.error(data.message || 'Failed to update video settings')
      }
    } catch (error) {
      toast.error('Error updating video settings')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading video settings...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Management
        </CardTitle>
        <CardDescription>
          Upload or replace the homepage video and manage the Book Now phone number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="video-upload">Video File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <Video className="h-12 w-12 mx-auto text-purple-600" />
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      const fileInput = document.getElementById('video-upload') as HTMLInputElement
                      if (fileInput) fileInput.value = ''
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      Select Video
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    MP4, WebM, or OGG (max 50MB)
                  </p>
                </div>
              )}
            </div>
            
            {settings.videoUrl && !selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Current video:</p>
                <video
                  src={settings.videoUrl}
                  className="w-full max-w-md rounded-lg border"
                  controls
                  style={{ maxHeight: '200px' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Phone Number Section */}
          <div className="space-y-2">
            <Label htmlFor="phone-number" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Book Now Phone Number
            </Label>
            <Input
              id="phone-number"
              type="tel"
              placeholder="917878787878"
              value={settings.phoneNumber}
              onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
              pattern="[0-9]+"
              maxLength={15}
            />
            <p className="text-xs text-gray-500">
              Enter the phone number for WhatsApp booking (with country code, no + or spaces)
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Updating...' : selectedFile ? 'Upload Video & Update Settings' : 'Update Phone Number'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
