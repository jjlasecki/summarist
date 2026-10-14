import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
 return (
  <div className="dashboard">
    <Sidebar />
    <main className="dashboard__content">{children}</main>
  </div>
);
}