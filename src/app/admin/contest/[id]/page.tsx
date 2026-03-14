import { redirect } from 'next/navigation';

export default async function ContestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/contest/${id}/problems`);
}
