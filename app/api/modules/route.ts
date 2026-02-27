export const dynamic = 'force-dynamic';

import { getAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthCookie();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    const where: Record<string, unknown> = {};
    if (courseId) {
      where.courseId = courseId;
    }

    const modules = await prisma.module.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    // Get user progress if user is a beneficiary
    let progressMap: Record<string, boolean> = {};
    if (auth.role === 'beneficiary') {
      const progress = await prisma.userProgress.findMany({
        where: { userId: auth.userId },
      });
      progressMap = Object.fromEntries(progress.map((p) => [p.moduleId, p.completed]));
    }

    return NextResponse.json({
      modules: modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        duration: m.duration,
        videoUrl: m.videoUrl,
        thumbnail: m.thumbnail,
        type: m.type,
        completed: progressMap[m.id] || false,
      })),
    });
  } catch (error) {
    console.error('Modules fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
