import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/lib/services';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ regNumber: string }> }
) {
  try {
    const { regNumber } = await params;
    const contestant = await services.contestantService.lookupByRegNumber(regNumber);
    return NextResponse.json({ success: true, data: contestant, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
