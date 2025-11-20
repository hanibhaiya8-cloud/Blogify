import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import VideoSettings from '../../../models/VideoSettings';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET video settings
export async function GET() {
  try {
    await dbConnect();
    
    // Try to get settings, if validation fails, create a new document with default values
    let settings;
    try {
      settings = await VideoSettings.getSettings();
    } catch (error: any) {
      // If validation fails, create a new document with safe defaults
      console.log('Creating new video settings due to validation error');
      const newSettings = new VideoSettings({
        videoUrl: '',
        phoneNumber: '917878787878'
      });
      settings = await newSettings.save();
    }
    
    return NextResponse.json({
      success: true,
      data: {
        videoUrl: settings.videoUrl,
        phoneNumber: settings.phoneNumber,
        updatedAt: settings.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error fetching video settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch video settings',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// POST/UPDATE video settings
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const phoneNumber = formData.get('phoneNumber') as string;
    
    if (!videoFile && !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Either video file or phone number is required' },
        { status: 400 }
      );
    }
    
    // Get existing settings or create new
    let settings;
    try {
      settings = await VideoSettings.getSettings();
    } catch (error: any) {
      // Create new settings if validation fails
      settings = new VideoSettings({
        videoUrl: '',
        phoneNumber: phoneNumber || '917878787878'
      });
    }
    
    // Handle video upload
    if (videoFile) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validTypes.includes(videoFile.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Only MP4, WebM, and OGG videos are allowed.' },
          { status: 400 }
        );
      }
      
      // Validate file size (50MB)
      if (videoFile.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'File size too large. Maximum size is 50MB.' },
          { status: 400 }
        );
      }
      
      // Save file to public/uploads directory
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Create directory if it doesn't exist
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `video-${timestamp}.${videoFile.type.split('/')[1]}`;
      const filepath = path.join(uploadsDir, filename);
      
      // Write file
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);
      
      // Update video URL
      settings.videoUrl = `/uploads/${filename}`;
    }
    
    // Update phone number if provided
    if (phoneNumber) {
      settings.phoneNumber = phoneNumber;
    }
    
    // Update timestamp
    settings.updatedAt = new Date();
    
    await settings.save();
    
    return NextResponse.json({
      success: true,
      data: {
        videoUrl: settings.videoUrl,
        phoneNumber: settings.phoneNumber,
        updatedAt: settings.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error updating video settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update video settings',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
