import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

// Get all profiles
export async function GET() {
  try {
    await dbConnect();
    const profiles = await Profile.find({}).sort({ createdAt: -1 });
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { message: 'Error fetching profiles' },
      { status: 500 }
    );
  }
}

// Create a new profile
export async function POST(request: Request) {
  try {
    const profileData = await request.json();
    await dbConnect();
    
    const newProfile = new Profile(profileData);
    const savedProfile = await newProfile.save();
    
    return NextResponse.json(savedProfile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { message: 'Error creating profile' },
      { status: 500 }
    );
  }
}
