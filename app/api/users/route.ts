export const dynamic = 'force-dynamic';

import { getAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthCookie();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || '';
    const statusFilter = searchParams.get('status') || '';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
      ];
    }
    if (roleFilter) {
      where.role = { slug: roleFilter };
    }
    if (statusFilter) {
      where.status = statusFilter;
    }

    const users = await prisma.user.findMany({
      where,
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });

    const totalUsers = await prisma.user.count();
    const beneficiaries = await prisma.user.count({ where: { role: { slug: 'beneficiary' } } });
    const staff = totalUsers - beneficiaries;
    const admins = await prisma.user.count({ where: { role: { slug: 'admin' } } });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        role: u.role.name,
        roleSlug: u.role.slug,
        roleCls: u.role.badgeCls || 'badge-primary',
        district: u.district || '-',
        status: u.status,
        statusCls: u.status === 'Active' ? 'badge-success' : 'badge-warning',
        lastLogin: u.lastLogin ? formatLastLogin(u.lastLogin) : 'Never',
      })),
      stats: { totalUsers, beneficiaries, staff, admins },
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthCookie();
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, roleSlug, district, password } = body;

    if (!firstName || !password) {
      return NextResponse.json({ error: 'Name and password are required' }, { status: 400 });
    }

    const role = await prisma.role.findUnique({ where: { slug: roleSlug || 'beneficiary' } });
    if (!role) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const mobile = phone || `01${Date.now().toString().slice(-9)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName || ''}`.trim(),
        email,
        mobile,
        phone,
        password: hashedPassword,
        roleId: role.id,
        district,
      },
      include: { role: true },
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
  } catch (error) {
    console.error('User create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function formatLastLogin(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return 'Just now';
  if (hours < 24) return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
}
