import { NextRequest, NextResponse } from 'next/server';
import { cacheTag, cacheLife } from 'next/cache';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { validateBody } from '@/lib/middleware/validate';
import { createProblemSchema } from '@/lib/schemas/problem.schema';
import { handleRouteError } from '@/lib/utils/route-handler';

async function getCachedProblems(contestId: number) {
  'use cache';
  cacheTag('problems');
  cacheLife('minutes');
  return services.problemService.listByContest(contestId);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const problems = await getCachedProblems(Number(id));
    return NextResponse.json({ success: true, data: problems, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const { id } = await params;
    const body = await request.json();
    const validated = validateBody(body, createProblemSchema);
    const problem = await services.problemService.createProblem(Number(id), validated);
    revalidateTag('problems', 'minutes');
    return NextResponse.json({ success: true, data: problem, error: null }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
