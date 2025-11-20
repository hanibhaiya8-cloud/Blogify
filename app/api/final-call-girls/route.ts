import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FinalCallGirl from '@/models/FinalCallGirl';

export async function GET() {
  try {
    await dbConnect();
    const items = await FinalCallGirl.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching final call girls' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const created = await FinalCallGirl.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating final call girl' }, { status: 500 });
  }
}
