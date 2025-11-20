import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Service from '@/models/Service';
import { Types } from 'mongoose';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }
    const item = await Service.findById(params.id);
    if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching service' }, { status: 500 });
  }
}

export async function PUT(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await _request.json();
    await dbConnect();
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }
    const updated = await Service.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating service' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }
    const deleted = await Service.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting service' }, { status: 500 });
  }
}
