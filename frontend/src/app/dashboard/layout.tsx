import { Sidebar } from '@/components/shared/Sidebar';
import { Chatbot } from '@/components/chatbot/Chatbot';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-bg-primary min-h-screen relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 overflow-auto relative z-10 pb-20">
        {children}
      </main>
      <Chatbot />
    </div>
  );
}
