import { NextRequest, NextResponse } from 'next/server';
import { gameStore } from '@/lib/gameStore';
import { SerializedGameState } from '@/types/game';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const state = body as SerializedGameState;
    
    gameStore.setState(state);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating game state:', error);
    return NextResponse.json(
      { error: 'Failed to update state' },
      { status: 500 }
    );
  }
}
