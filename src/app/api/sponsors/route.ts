import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function GET() {
  try {
    const sponsors = await services.sponsorRepo.findAll();
    return NextResponse.json({ success: true, data: sponsors, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const body = await request.json();
    const sponsor = await services.sponsorRepo.create({
      name: body.name,
      logo_url: body.logo_url,
      description: body.description,
      detail: body.detail,
      website: body.website,
      founded: body.founded,
      focus: body.focus,
      tier: body.tier,
      sort_order: body.sort_order,
    });
    revalidateTag('sponsors', 'seconds');
    return NextResponse.json({ success: true, data: sponsor, error: null }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
