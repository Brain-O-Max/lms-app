import { setAuthCookie } from '@/lib/auth';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mobile, password } = await request.json();

    if (!mobile || !password) {
      return NextResponse.json({ error: 'Mobile number and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { mobile: mobile.trim() },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status !== 'Active') {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Set JWT cookie
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
        roleName: user.role.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
