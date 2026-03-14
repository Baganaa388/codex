import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const { contestId } = await params;
    await services.scoringService.recalculateLeaderboard(Number(contestId));
    revalidateTag('leaderboard', 'minutes');
    return NextResponse.json({ success: true, data: { message: 'Leaderboard recalculated' }, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
