import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { validateBody } from '@/lib/middleware/validate';
import { createSubmissionSchema } from '@/lib/schemas/submission.schema';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function POST(request: NextRequest) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const body = await request.json();
    const validated = validateBody(body, createSubmissionSchema);
    const submission = await services.scoringService.submitScore(validated);
    revalidateTag('leaderboard', 'minutes');
    revalidateTag('contestants', 'minutes');
    return NextResponse.json({ success: true, data: submission, error: null }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
