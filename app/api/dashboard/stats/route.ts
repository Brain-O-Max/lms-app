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

    if (auth.role === 'beneficiary') {
      // Beneficiary dashboard stats
      const totalModules = await prisma.module.count();
      const completedModules = await prisma.userProgress.count({
        where: { userId: auth.userId, completed: true },
      });
      const inProgress = totalModules - completedModules;
      const completionPercentage = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);

      return NextResponse.json({
        type: 'beneficiary',
        stats: { totalModules, completedModules, inProgress, completionPercentage },
      });
    } else {
      // Staff/Admin dashboard stats
      const totalBeneficiaries = await prisma.user.count({ where: { role: { slug: 'beneficiary' } } });
      const totalCompletions = await prisma.userProgress.count({ where: { completed: true } });
      const activeSessions = await prisma.session.count();
      const certificatesIssued = await prisma.userProgress.count({
        where: {
          completed: true,
          user: { role: { slug: 'beneficiary' } },
        },
      });

      return NextResponse.json({
        type: 'staff',
        stats: { totalBeneficiaries, completedCourses: totalCompletions, activeSessions, certificatesIssued },
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
