import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import DemoBanner from '@/components/DemoBanner';

export const metadata = {
  title: 'Dashboard — DashPulse Analytics',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DemoBanner />
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--bg-primary)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
