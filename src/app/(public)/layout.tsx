import { Navbar, Footer } from '@/components/Layout';
import { PublicMain } from '@/components/PublicMain';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <PublicMain>{children}</PublicMain>
      <Footer />
    </div>
  );
}
