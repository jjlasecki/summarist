import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import "./dashboard.css";
import MobileSidebar from "@/components/MobileSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard__content">
        <header className="flex items-center justify-end gap-4 border-b border-gray-200 px-8 py-5">
          <div className="w-full max-w-[340px]">
            <SearchBar />
          </div>
          <MobileSidebar />
        </header>
        {children}
      </main>
    </div>
  );
}
