import { NextRequest, NextResponse } from 'next/server';
import { cacheTag, cacheLife } from 'next/cache';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { validateBody } from '@/lib/middleware/validate';
import { createContestSchema } from '@/lib/schemas/contest.schema';
import { handleRouteError } from '@/lib/utils/route-handler';

async function getCachedContests() {
  'use cache';
  cacheTag('contests');
  cacheLife('minutes');
  return services.contestService.listContests();
}

export async function GET() {
  try {
    const contests = await getCachedContests();
    return NextResponse.json({ success: true, data: contests, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const body = await request.json();
    const validated = validateBody(body, createContestSchema);
    const contest = await services.contestService.createContest(validated);
    revalidateTag('contests', 'minutes');
    return NextResponse.json({ success: true, data: contest, error: null }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
