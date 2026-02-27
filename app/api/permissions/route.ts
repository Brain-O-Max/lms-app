export const dynamic = 'force-dynamic';

import { getAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthCookie();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roleSlug = searchParams.get('role');

    if (!roleSlug) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    const role = await prisma.role.findUnique({
      where: { slug: roleSlug },
      include: { permissions: true },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json({
      role: { name: role.name, slug: role.slug },
      permissions: role.permissions.map((p) => ({
        id: p.id,
        module: p.module,
        canView: p.canView,
        canCreate: p.canCreate,
        canEdit: p.canEdit,
        canDelete: p.canDelete,
      })),
    });
  } catch (error) {
    console.error('Permissions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
