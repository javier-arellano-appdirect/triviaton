import { NextResponse } from 'next/server';

// This is a simple endpoint that the game page can call
// The admin page will poll this or we can use a different mechanism
// For simplicity, we'll just have the admin page auto-advance after a delay

export async function POST() {
  return NextResponse.json({ success: true });
}
