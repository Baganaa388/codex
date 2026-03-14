import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const { id } = await params;
    await services.sponsorRepo.deleteById(Number(id));
    revalidateTag('sponsors', 'seconds');
    return NextResponse.json({ success: true, data: null, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
