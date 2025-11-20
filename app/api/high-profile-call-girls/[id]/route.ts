import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import HighProfileCallGirl from '../../../../models/HighProfileCallGirl';

// Get single high profile call girl
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const profile = await HighProfileCallGirl.findById(params.id).exec();
    
    if (!profile) {
      return NextResponse.json(
        { message: 'High profile call girl not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching high profile call girl:', error);
    return NextResponse.json(
      { message: 'Error fetching high profile call girl' },
      { status: 500 }
    );
  }
}

// Update high profile call girl
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await request.json();
    await dbConnect();
    
    const updatedProfile = await HighProfileCallGirl.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedProfile) {
      return NextResponse.json(
        { message: 'High profile call girl not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating high profile call girl:', error);
    return NextResponse.json(
      { message: 'Error updating high profile call girl' },
      { status: 500 }
    );
  }
}

// Delete high profile call girl
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const deletedProfile = await HighProfileCallGirl.findByIdAndDelete(params.id).exec();
    
    if (!deletedProfile) {
      return NextResponse.json(
        { message: 'High profile call girl not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'High profile call girl deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting high profile call girl:', error);
    return NextResponse.json(
      { message: 'Error deleting high profile call girl' },
      { status: 500 }
    );
  }
}
