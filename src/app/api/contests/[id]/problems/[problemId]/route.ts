import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; problemId: string }> },
) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const { problemId } = await params;
    await services.problemService.deleteProblem(Number(problemId));
    revalidateTag('problems', 'minutes');
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
