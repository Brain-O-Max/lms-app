export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      include: { upazilas: { orderBy: { name: 'asc' } } },
      orderBy: { name: 'asc' },
    });

    const result: Record<string, string[]> = {};
    const districtNames: string[] = [];

    for (const d of districts) {
      districtNames.push(d.name);
      result[d.name] = d.upazilas.map((u) => u.name);
    }

    return NextResponse.json({ districts: districtNames, upazilas: result });
  } catch (error) {
    console.error('Locations fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
