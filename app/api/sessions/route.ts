export const dynamic = 'force-dynamic';

import { getAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = await getAuthCookie();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        name: s.name,
        date: s.date.toISOString().split('T')[0],
        district: s.district,
        upazila: s.upazila,
        union: s.unionName,
        unitOffice: s.unitOffice,
        participants: s.participants,
        male: s.male,
        female: s.female,
        unitManager: s.unitManager,
        status: s.status,
      })),
    });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
