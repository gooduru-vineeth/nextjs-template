import { NextResponse } from 'next/server';
import { deleteSession } from '@/libs/Auth';

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json(
      { success: true },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 },
    );
  }
}
