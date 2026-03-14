import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function GET() {
  try {
    const slides = await services.slideRepo.findAll();
    return NextResponse.json({ success: true, data: slides, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const body = await request.json();
    const slide = await services.slideRepo.create({
      image_url: body.image_url,
      title: body.title,
      sort_order: body.sort_order,
    });
    revalidateTag('slides', 'seconds');
    return NextResponse.json({ success: true, data: slide, error: null }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
