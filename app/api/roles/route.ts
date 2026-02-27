export const dynamic = 'force-dynamic';

import { getAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = await getAuthCookie();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const roles = await prisma.role.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      roles: roles.map((r) => ({
        slug: r.slug,
        title: r.name,
        description: r.description,
        accessLevel: r.accessLevel,
        icon: r.icon,
        badge: r.badge,
        badgeCls: r.badgeCls,
        cardCls: r.cardCls,
        users: `${r._count.users} users assigned`,
        userCount: r._count.users,
      })),
    });
  } catch (error) {
    console.error('Roles fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
