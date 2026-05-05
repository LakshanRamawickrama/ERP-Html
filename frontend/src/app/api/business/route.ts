import { NextResponse } from 'next/server';
import { ENTITIES, STRUCTURES } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ entities: ENTITIES, structures: STRUCTURES });
}
