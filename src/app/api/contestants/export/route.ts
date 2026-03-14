import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function GET(request: NextRequest) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const { searchParams } = new URL(request.url);
    const contestId = Number(searchParams.get('contest_id'));
    if (!contestId) {
      return NextResponse.json(
        { success: false, data: null, error: 'contest_id query param required' },
        { status: 400 }
      );
    }

    const result = await services.contestantService.listByContest(contestId, { limit: 10000 });
    const rows = result.rows;

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
      return str;
    };

    const header = ['Дугаар', 'Овог', 'Нэр', 'Имэйл', 'Утас', 'Сургууль', 'Ангилал', 'Төлбөр', 'Бүртгэсэн огноо'];
    const csvRows = rows.map(c => [
      c.reg_number,
      c.last_name,
      c.first_name,
      c.email,
      c.phone,
      c.organization,
      c.category,
      c.payment_status === 'paid' ? 'Төлсөн' : c.payment_status === 'free' ? 'Үнэгүй' : 'Хүлээгдэж буй',
      new Date(c.created_at).toISOString(),
    ].map(escapeCsv).join(','));

    const bom = '\uFEFF';
    const csv = bom + [header.join(','), ...csvRows].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=contestants-${contestId}.csv`,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
