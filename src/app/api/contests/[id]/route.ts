import { NextRequest, NextResponse } from 'next/server';
import { cacheTag, cacheLife } from 'next/cache';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { validateBody } from '@/lib/middleware/validate';
import { updateContestSchema } from '@/lib/schemas/contest.schema';
import { handleRouteError } from '@/lib/utils/route-handler';

async function getCachedContest(id: number) {
  'use cache';
  cacheTag('contests');
  cacheLife('minutes');
  return services.contestService.getContest(id);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contest = await getCachedContest(Number(id));
    return NextResponse.json({ success: true, data: contest, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const { id } = await params;
    const body = await request.json();
    const validated = validateBody(body, updateContestSchema);
    const contest = await services.contestService.updateContest(Number(id), validated);
    revalidateTag('contests', 'minutes');
    return NextResponse.json({ success: true, data: contest, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
