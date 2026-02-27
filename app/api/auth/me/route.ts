export const dynamic = 'force-dynamic';

import { getAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getAuthCookie();
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role.slug,
        roleName: user.role.name,
        district: user.district,
        status: user.status,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
