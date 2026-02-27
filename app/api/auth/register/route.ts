import { setAuthCookie } from '@/lib/auth';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mobile, email, password, roleSlug, district } = body;

    if (!name || !mobile || !password) {
      return NextResponse.json({ error: 'Name, mobile, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { mobile } });
    if (existing) {
      return NextResponse.json({ error: 'Mobile number already registered' }, { status: 409 });
    }

    // Find the role
    const role = await prisma.role.findUnique({ where: { slug: roleSlug || 'beneficiary' } });
    if (!role) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        mobile,
        email,
        password: hashedPassword,
        roleId: role.id,
        district,
      },
      include: { role: true },
    });

    // Auto-login after registration
    await setAuthCookie({
      userId: user.id,
      role: user.role.slug,
      name: user.name,
      mobile: user.mobile,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role.slug,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
