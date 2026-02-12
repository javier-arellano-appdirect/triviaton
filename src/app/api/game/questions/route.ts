import { NextResponse } from 'next/server';
import { loadQuestions } from '@/lib/questions';

export async function GET() {
  try {
    const questions = loadQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error loading questions:', error);
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    );
  }
}
