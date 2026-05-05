import { NextResponse } from 'next/server';
import { USER_SYSTEM_MAP, USER_REGISTRY } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    systemMap: USER_SYSTEM_MAP,
    registry: USER_REGISTRY,
  });
}
