import { NextRequest, NextResponse } from 'next/server';
import { cacheTag, cacheLife } from 'next/cache';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { validateBody } from '@/lib/middleware/validate';
import { registerContestantSchema } from '@/lib/schemas/contestant.schema';
import { handleRouteError } from '@/lib/utils/route-handler';

async function getCachedContestants(
  contestId: number,
  opts: { category?: string; search?: string; page?: number; limit?: number },
) {
  'use cache';
  cacheTag('contestants');
  cacheLife('minutes');
  return services.contestantService.listByContest(contestId, opts);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contestId = Number(searchParams.get('contest_id'));
    if (!contestId) {
      return NextResponse.json(
        { success: false, data: null, error: 'contest_id query param required' },
        { status: 400 }
      );
    }

    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const result = await getCachedContestants(contestId, {
      category: searchParams.get('category') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.rows,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateBody(body, registerContestantSchema);
    const contestant = await services.contestantService.register(validated);
    revalidateTag('contestants', 'minutes');
    return NextResponse.json({ success: true, data: contestant, error: null }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
