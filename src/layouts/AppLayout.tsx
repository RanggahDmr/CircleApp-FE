import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 min-h-screen bg-black text-white">
      <Sidebar />
      <main className="col-span-12 md:col-span-10 lg:col-span-7 border-r border-gray-800">
        {children}
      </main>
      <RightSidebar />
    </div>
  );
}
