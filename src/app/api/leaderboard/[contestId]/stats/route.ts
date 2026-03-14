import { NextRequest, NextResponse } from 'next/server';
import { cacheTag, cacheLife } from 'next/cache';
import { services } from '@/lib/services';
import { handleRouteError } from '@/lib/utils/route-handler';

async function getCachedStats(contestId: number) {
  'use cache';
  cacheTag('leaderboard');
  cacheLife('minutes');
  return services.leaderboardService.getProblemStatistics(contestId);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    const { contestId } = await params;
    const stats = await getCachedStats(Number(contestId));
    return NextResponse.json({ success: true, data: stats, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
