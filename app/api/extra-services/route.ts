import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ExtraService from '@/models/ExtraService';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = category ? { category } : {};
    const items = await ExtraService.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching extra services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const created = await ExtraService.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating extra service' }, { status: 500 });
  }
}
