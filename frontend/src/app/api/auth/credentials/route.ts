import { NextResponse } from 'next/server';
import { LOGIN_CREDENTIALS } from '@/lib/db';

export async function GET() {
  return NextResponse.json(LOGIN_CREDENTIALS);
}
