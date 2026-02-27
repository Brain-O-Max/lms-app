export const dynamic = 'force-dynamic';

import { getAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = await getAuthCookie();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      include: { _count: { select: { modules: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      courses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        duration: c.duration,
        modules: c._count.modules,
        icon: c.icon,
        gradient: c.gradient,
      })),
    });
  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthCookie();
    if (!auth || auth.role === 'beneficiary') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, category, duration, moduleCount } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        duration,
        icon: '📘',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
    });

    // Create placeholder modules if moduleCount is provided
    if (moduleCount && parseInt(moduleCount) > 0) {
      const count = parseInt(moduleCount);
      for (let i = 1; i <= count; i++) {
        await prisma.module.create({
          data: {
            title: `Module ${i}`,
            courseId: course.id,
            sortOrder: i,
          },
        });
      }
    }

    return NextResponse.json({ success: true, course: { id: course.id, title: course.title } });
  } catch (error) {
    console.error('Course create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
