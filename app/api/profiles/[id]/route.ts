import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import { Types } from 'mongoose';

// Get a single profile by ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid profile ID' },
        { status: 400 }
      );
    }

    const profile = await Profile.findById(params.id);
    
    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Error fetching profile' },
      { status: 500 }
    );
  }
}

// Update a profile by ID
export async function PUT(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profileData = await _request.json();
    await dbConnect();
    
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid profile ID' },
        { status: 400 }
      );
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      params.id,
      profileData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Error updating profile' },
      { status: 500 }
    );
  }
}

// Delete a profile by ID
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid profile ID' },
        { status: 400 }
      );
    }

    const deletedProfile = await Profile.findByIdAndDelete(params.id);
    
    if (!deletedProfile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { message: 'Error deleting profile' },
      { status: 500 }
    );
  }
}
