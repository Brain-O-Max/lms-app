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

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get progress for beneficiary
    let progressData = null;
    if (user.role.slug === 'beneficiary') {
      const totalModules = await prisma.module.count();
      const completedCount = await prisma.userProgress.count({
        where: { userId: user.id, completed: true },
      });
      progressData = {
        completedCount,
        totalModules,
        progressPercent: totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100),
      };
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role.slug,
        roleName: user.role.name,
        district: user.district,
        gender: user.gender,
        dob: user.dob,
        nid: user.nid,
        familyMembers: user.familyMembers,
        monthlyIncome: user.monthlyIncome,
        relationToMigrant: user.relationToMigrant,
        primaryEarnings: user.primaryEarnings,
        migrantCountry: user.migrantCountry,
        yearsAbroad: user.yearsAbroad,
        monthlyRemittance: user.monthlyRemittance,
        bankAccountUsage: user.bankAccountUsage,
        insuranceCoverage: user.insuranceCoverage,
        digitalAppUsage: user.digitalAppUsage,
      },
      progress: progressData,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthCookie();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await prisma.user.update({
      where: { id: auth.userId },
      data: {
        name: body.name,
        email: body.email,
        gender: body.gender,
        dob: body.dob ? new Date(body.dob) : undefined,
        nid: body.nid,
        familyMembers: body.familyMembers ? parseInt(body.familyMembers) : undefined,
        monthlyIncome: body.monthlyIncome ? parseInt(body.monthlyIncome) : undefined,
        relationToMigrant: body.relationToMigrant,
        primaryEarnings: body.primaryEarnings,
        migrantCountry: body.migrantCountry,
        yearsAbroad: body.yearsAbroad ? parseInt(body.yearsAbroad) : undefined,
        monthlyRemittance: body.monthlyRemittance ? parseInt(body.monthlyRemittance) : undefined,
        bankAccountUsage: body.bankAccountUsage === 'yes' || body.bankAccountUsage === true,
        insuranceCoverage: body.insuranceCoverage === 'yes' || body.insuranceCoverage === true,
        digitalAppUsage: body.digitalAppUsage === 'yes' || body.digitalAppUsage === true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
