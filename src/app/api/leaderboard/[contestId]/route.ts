import { NextRequest, NextResponse } from 'next/server';
import { cacheTag, cacheLife } from 'next/cache';
import { services } from '@/lib/services';
import { handleRouteError } from '@/lib/utils/route-handler';

async function getCachedLeaderboard(
  contestId: number,
  opts: { category?: string; search?: string; page?: number; limit?: number },
) {
  'use cache';
  cacheTag('leaderboard');
  cacheLife('minutes');
  return services.leaderboardService.getLeaderboard(contestId, opts);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    const { contestId } = await params;
    const { searchParams } = new URL(request.url);

    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const result = await getCachedLeaderboard(Number(contestId), {
      category: searchParams.get('category') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.entries,
      error: null,
      meta: {
        total: result.total,
        page: page ?? 1,
        limit: limit ?? 50,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
