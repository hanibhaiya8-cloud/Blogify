import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import HighProfileCallGirl from '../../../models/HighProfileCallGirl';

// Get all high profile call girls
export async function GET() {
  try {
    await dbConnect();
    const profiles = await HighProfileCallGirl.find({}).sort({ createdAt: -1 }).exec();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching high profile call girls:', error);
    return NextResponse.json(
      { message: 'Error fetching high profile call girls' },
      { status: 500 }
    );
  }
}

// Create a new high profile call girl
export async function POST(request: Request) {
  try {
    const profileData = await request.json();
    await dbConnect();
    
    const newProfile = new HighProfileCallGirl(profileData);
    const savedProfile = await newProfile.save();
    
    return NextResponse.json(savedProfile, { status: 201 });
  } catch (error) {
    console.error('Error creating high profile call girl:', error);
    return NextResponse.json(
      { message: 'Error creating high profile call girl' },
      { status: 500 }
    );
  }
}
